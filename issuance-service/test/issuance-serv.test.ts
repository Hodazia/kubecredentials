/*

test the api's , 

- get /health -> 200
- get /credentials -> 200
- post /issue -> 409 OR 200


Run the command -> npx vitest run
to test all the test cases!
*/

import request from "supertest"
import app from "../src/index"
import  { describe , it, expect} from "vitest"



describe("GET /health", () => {
    it("should return 200 and certain health info" , async () => {
        const response = await request(app).get("/health");

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty("status", "healthy");
        expect(response.body).toHaveProperty("service", "issuance");
        expect(response.body).toHaveProperty("worker");
        expect(response.body).toHaveProperty("timestamp");
    })
})

describe("GET /credentials", () => {
    it("should return 200 and a list of credentials", async () => {
      const response = await request(app).get("/credentials");
  
      
      expect(response.status).toBe(200);
  
      
      expect(response.body.success).toBe(true);
  
    
      expect(Array.isArray(response.body.credentials)).toBe(true);
  
      
      expect(response.body.count).toBe(response.body.credentials.length);
  
      
      expect(response.body.credentials.length).toBeGreaterThan(0);
  
      
      const credential = response.body.credentials[0];
      expect(credential).toHaveProperty("id");
      expect(credential).toHaveProperty("credentialData");
      expect(credential).toHaveProperty("credentialHash");
      expect(credential).toHaveProperty("workerId");
      expect(credential).toHaveProperty("issuedAt");
  
      // Validate inner structure of credentialData
      const data = credential.credentialData;
      expect(data).toHaveProperty("holderName");
      expect(data).toHaveProperty("credentialType");
      expect(data).toHaveProperty("issueDate");
    });
  
    it("should return valid ISO timestamps for issuedAt fields", async () => {
      const response = await request(app).get("/credentials");
      const creds = response.body.credentials;
  
      for (const c of creds) {
        expect(() => new Date(c.issuedAt)).not.toThrow();
        expect(isNaN(Date.parse(c.issuedAt))).toBe(false);
      }
    });
  });


describe("POST /issue" , () => {
    it("issuing a user ", async ()=> {
        // if the user is already issued, then returns a 409 error
        // if the user not issued then returns a 200 ok!

        const payload = { holderName: 'Charlie5', credentialType: 'Contractor5', issueDate: '2025-10-08' };
        const res = await request(app).post('/issue').send(payload);
        expect(res.status).toBe(201);
        expect(res.body.success).toBe(true);
        expect(res.body.credential).toBeDefined();
        expect(res.body.workerId).toBeDefined();

    })

    it("duplicate user mocking!" , async () => {
         const payload = { holderName: 'Anjum', credentialType: 'Worker', issueDate: '2025-10-10', expiryDate: "2025-10-12" };
        await request(app).post('/issue').send(payload).expect(409);
        const res = await request(app).post('/issue').send(payload);
        expect(res.status).toBe(409);
        expect(res.body.success).toBe(false);

    })
})

