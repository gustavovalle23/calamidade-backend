import { APP_URL, ADMIN_EMAIL, ADMIN_PASSWORD } from "../utils/constants";
import request from "supertest";
import { UserRoleEnum } from "../../src/modules/user/enums/roles.enum";
import { UserStatusEnum } from "../../src/modules/user/enums/status.enum";

describe("Users admin (e2e)", () => {
  const app = APP_URL;
  let newUserFirst;
  const now = Date.now()
  const newUserEmailFirst = `user-first.${now}@example.com`;
  const newUserPasswordFirst = `secrettttttttt`;
  const newUserChangedPasswordFirst = `new-secret`;
  const newUserByAdminEmailFirst = `user-created-by-admin.${now}@example.com`;
  const newUserByAdminPasswordFirst = `secret`;
  const newUserDocument = '44444444442'
  let apiToken;

  beforeAll(async () => {
    await request(app)
      .post(`/${process.env.API_PREFIX}/v1/auth/admin/email/login`)
      .send({ email: ADMIN_EMAIL, password: ADMIN_PASSWORD })
      .then(({ body }) => {
        apiToken = body.token;
      });

    await request(app)
      .post(`/${process.env.API_PREFIX}/v1/cooperateds`)
      .auth(apiToken, {
        type: "bearer",
      })
      .send({
        email: newUserEmailFirst,
        firstName: `First${now}`,
        lastName: "E2E",
        document: newUserDocument,
        phone: "16993000000",
        organization: 1,
      })
      .then(({ body }) => {
        console.log(body);
      });

      console.log(newUserEmailFirst)
    await request(app)
      .post(`/${process.env.API_PREFIX}/v1/auth/email/register`)
      .send({
        email: newUserEmailFirst,
        password: newUserPasswordFirst,
        firstName: `First${now}`,
        lastName: "E2E",
        document: newUserDocument,
        telephone: "16111111111",
      })
      .then(({ body }) => {
        // console.log(body);
      });

    await request(app)
      .post(`/${process.env.API_PREFIX}/v1/auth/email/login`)
      .send({ email: newUserEmailFirst, password: newUserPasswordFirst })
      .then(({ body }) => {
        newUserFirst = body.user;
        console.log(body);
      });
  });

  it.only(`Change password for new user: /${process.env.API_PREFIX}/v1/user/:id (PATCH)`, () => {
    return request(app)
      .patch(`/${process.env.API_PREFIX}/v1/user/${newUserFirst.id}`)
      .auth(apiToken, {
        type: "bearer",
      })
      .send({ password: newUserChangedPasswordFirst })
      .expect(200);
  });

  it(`Login via registered user: /${process.env.API_PREFIX}/v1/auth/email/login (POST)`, () => {
    return request(app)
      .post(`/${process.env.API_PREFIX}/v1/auth/email/login`)
      .send({ email: newUserEmailFirst, password: newUserChangedPasswordFirst })
      .expect(200)
      .expect(({ body }) => {
        expect(body.token).toBeDefined();
      });
  });

  it(`Fail create new user by admin: /${process.env.API_PREFIX}/v1/user (POST)`, () => {
    return request(app)
      .post(`/${process.env.API_PREFIX}/v1/user`)
      .auth(apiToken, {
        type: "bearer",
      })
      .send({ email: "fail-data" })
      .expect(422);
  });

  it(`Success create new user by admin: /${process.env.API_PREFIX}/v1/user (POST)`, () => {
    return request(app)
      .post(`/${process.env.API_PREFIX}/v1/user`)
      .auth(apiToken, {
        type: "bearer",
      })
      .send({
        email: newUserByAdminEmailFirst,
        password: newUserByAdminPasswordFirst,
        firstName: `UserByAdmin${now}`,
        lastName: "E2E",
        role: {
          id: UserRoleEnum.user,
        },
        status: {
          id: UserStatusEnum.active,
        },
      })
      .expect(201);
  });

  it(`Login via created by admin user: /${process.env.API_PREFIX}/v1/auth/email/login (GET)`, () => {
    return request(app)
      .post(`/${process.env.API_PREFIX}/v1/auth/email/login`)
      .send({
        email: newUserByAdminEmailFirst,
        password: newUserByAdminPasswordFirst,
      })
      .expect(200)
      .expect(({ body }) => {
        expect(body.token).toBeDefined();
      });
  });

  it(`Get list of users by admin: /${process.env.API_PREFIX}/v1/user (GET)`, () => {
    return request(app)
      .get(`/${process.env.API_PREFIX}/v1/user/list`)
      .auth(apiToken, {
        type: "bearer",
      })
      .expect(200)
      .send()
      .expect(({ body }) => {
        expect(body.data[0].provider).toBeDefined();
        expect(body.data[0].email).toBeDefined();
        expect(body.data[0].hash).not.toBeDefined();
        expect(body.data[0].password).not.toBeDefined();
        expect(body.data[0].previousPassword).not.toBeDefined();
      });
  });
});
