import "dotenv/config";
import assert from "node:assert/strict";
import { after, before, describe, it } from "node:test";
import type { AddressInfo } from "node:net";
import type { Server } from "node:http";
import { prisma } from "../lib/prisma";
import { signToken } from "../src/utils/jwt";

type JsonResponse<T = any> = {
  success?: boolean;
  message?: string;
  data?: T;
  error?: string;
};

const testEmail = `address-api-${Date.now()}@example.com`;

process.env.NODE_ENV = "test";

let server: Server;
let baseUrl: string;
let userId: string;
let token: string;

const addressPayload = {
  label: "Home",
  line1: "123 Main Street",
  line2: "Unit 4",
  city: "Yangon",
  state: "Yangon",
  postalCode: "11181",
  country: "Myanmar",
};

const request = async <T = any>(
  path: string,
  options: RequestInit = {},
): Promise<{ status: number; body: JsonResponse<T> }> => {
  const response = await fetch(`${baseUrl}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  return {
    status: response.status,
    body: (await response.json()) as JsonResponse<T>,
  };
};

before(async () => {
  const { default: app } = await import("../src/app");

  server = app.listen(0);
  await new Promise<void>((resolve) => server.once("listening", resolve));
  const address = server.address() as AddressInfo;
  baseUrl = `http://127.0.0.1:${address.port}`;

  const user = await prisma.user.create({
    data: {
      email: testEmail,
      passwordHash: "test-password-hash",
      name: "Address API Test User",
    },
    select: { id: true, email: true },
  });

  userId = user.id;
  token = signToken({ userId: user.id, email: user.email });
});

after(async () => {
  if (userId) {
    await prisma.user.deleteMany({ where: { id: userId } });
  }
  await prisma.$disconnect();
  await new Promise<void>((resolve, reject) => {
    server.close((error) => (error ? reject(error) : resolve()));
  });
});

describe("Address API", () => {
  it("rejects requests without a token", async () => {
    const response = await fetch(`${baseUrl}/api/addresses`);
    const body = (await response.json()) as JsonResponse;

    assert.equal(response.status, 401);
    assert.equal(body.error, "missing token");
  });

  it("creates the first address as default", async () => {
    const { status, body } = await request("/api/addresses", {
      method: "POST",
      body: JSON.stringify(addressPayload),
    });

    assert.equal(status, 201);
    assert.equal(body.success, true);
    assert.equal(body.data.line1, addressPayload.line1);
    assert.equal(body.data.isDefault, true);
  });

  it("validates required address fields", async () => {
    const { status, body } = await request("/api/addresses", {
      method: "POST",
      body: JSON.stringify({ city: "Yangon" }),
    });

    assert.equal(status, 400);
    assert.equal(body.success, false);
    assert.match(body.message ?? "", /line1/i);
    assert.match(body.message ?? "", /postalCode/i);
    assert.match(body.message ?? "", /country/i);
  });

  it("lists, reads, updates, defaults, and deletes addresses for the user", async () => {
    const second = await request("/api/addresses", {
      method: "POST",
      body: JSON.stringify({
        ...addressPayload,
        label: "Office",
        line1: "456 Merchant Road",
        isDefault: false,
      }),
    });

    assert.equal(second.status, 201);
    assert.equal(second.body.data.isDefault, false);

    const list = await request<any[]>("/api/addresses");
    assert.equal(list.status, 200);
    assert.equal(list.body.data?.length, 2);
    assert.equal(list.body.data?.[0].isDefault, true);

    const addressId = second.body.data.id;
    const read = await request(`/api/addresses/${addressId}`);
    assert.equal(read.status, 200);
    assert.equal(read.body.data.label, "Office");

    const updated = await request(`/api/addresses/${addressId}`, {
      method: "PUT",
      body: JSON.stringify({ city: "Mandalay", isDefault: true }),
    });
    assert.equal(updated.status, 200);
    assert.equal(updated.body.data.city, "Mandalay");
    assert.equal(updated.body.data.isDefault, true);

    const defaulted = await request(`/api/addresses/${addressId}/default`, {
      method: "PATCH",
    });
    assert.equal(defaulted.status, 200);
    assert.equal(defaulted.body.data.isDefault, true);

    const deleted = await request(`/api/addresses/${addressId}`, {
      method: "DELETE",
    });
    assert.equal(deleted.status, 200);
    assert.equal(deleted.body.data.id, addressId);

    const missing = await request(`/api/addresses/${addressId}`);
    assert.equal(missing.status, 404);
    assert.equal(missing.body.message, "address not found");
  });
});
