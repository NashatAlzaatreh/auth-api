"use strict";

require("dotenv").config();
process.env.SECRET = "abcdefghijklmnopqrstuvwxyz";
const supertest = require("supertest");
const { app } = require("../src/server");
const mock = supertest(app);

describe("admin", () => {
  let token;
  let id;

  it("sign up", async () => {
    const res = await mock
      .post("/signup")
      .send({ username: "test", password: "test", role: "admin" });
    expect(res.status).toEqual(201);
  });

  it("sign in", async () => {
    const res = await mock.post("/signin").auth("test", "test");
    token = res.body.token;
    expect(res.status).toEqual(200);
    expect(res.body.user.role).toEqual("admin");
    expect(res.body.token).toEqual(token);
  });

  it("GET all", async () => {
    const res1 = await mock
      .post("/api/v1/food")
      .send({
        name: "Mansaf",
        calories: 1500,
        type: "protien",
      })
      .set({ Authorization: `Bearer ${token}` });
    const res = await mock.get("/api/v1/food");
    expect(res.status).toEqual(200);
    expect(res.body[1]._id).toBeDefined();
    expect(res.body[1].name).toEqual("Mansaf");
    expect(res.body[1].type).toEqual("PROTIEN");
    expect(res.body.length).toEqual(2);
  });

  it("GET one", async () => {
    const res = await mock.get(`/api/v1/food/${id}`);
    expect(res.status).toEqual(200);
    expect(res.body._id).toBeDefined();
    expect(res.body.name).toEqual("Salad");
    expect(res.body.type).toEqual("VEGETABLE");
    expect(res.body._id).toEqual(id);
  });

  it("DELETE", async () => {
    const res = await mock
      .delete(`/api/v1/food/${id}`)
      .set({ Authorization: `Bearer ${token}` });
    expect(res.status).toEqual(200);
    const res1 = await mock.get(`/api/v1/food/${id}`);
    expect(res1.status).toEqual(200);
    expect(res1.body).toEqual(null);
    const res2 = await mock.get("/api/v1/food/");
    expect(res2.body.length).toEqual(1);
  });
});
