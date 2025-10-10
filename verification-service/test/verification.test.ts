/*

- GEt /health
- POST /api/verify
- GET /api/verify/history

*/


import request from "supertest"
import app from "../src/index"
import  { describe , it, expect} from "vitest"


describe("GET /health", () => {
    it("should return 200 and certain health info" , async () => {
        const response = await request(app).get("/health");

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty("status", "healthy");
        expect(response.body).toHaveProperty("service", "verification");
        expect(response.body).toHaveProperty("worker");
        expect(response.body).toHaveProperty("timestamp");
    })
})

describe("GET api/verify/history " ,() => {
    it("should return 200 and list of verified users ", async () => {
        const response = await request(app).get("/api/verify/history");
  

      expect(response.status).toBe(200);
  

      expect(response.body.success).toBe(true);
  

      expect(Array.isArray(response.body.history)).toBe(true);
  

      expect(response.body.count).toBe(response.body.history.length);
  

      expect(response.body.history.length).toBeGreaterThan(0);
  
      const verifieddata = response.body.history[0];
      expect(verifieddata).toHaveProperty("id");
      expect(verifieddata).toHaveProperty("credentialHash");
      expect(verifieddata).toHaveProperty("workerId");
      expect(verifieddata).toHaveProperty("verifiedAt");
  
      // Validate inner structure of credentialData
      const data = verifieddata.credentialData;
      expect(data).toHaveProperty("holderName");
      expect(data).toHaveProperty("credentialType");
      expect(data).toHaveProperty("issueDate");
    })
})


describe("POST api/verify" , () => {
    const API_BASE = "https://verification.zia-hoda.org";

    // can also use hosted backend url's too!
    it("should return 200 ", async () => {

        const payload = {
            "holderName": "Nayab2025",
            "credentialType": "Developer",
            "issueDate": "2025-10-08"
        }
        const res = await request(API_BASE).post('/api/verify').send(payload);
        expect(res.status).toBe(200);
        expect(res.body.valid).toBe(true);
        expect(res.body.message).toBeDefined();
        expect(res.body.workerId).toBeDefined();
    })


    it("should return 200 and valid is false!", async () => {
        const payload = {
            "holderName": "XYZlko",
            "credentialType": "Developer",
            "issueDate": "2025-10-08"
        }
        const res = await request(API_BASE).post('/api/verify').send(payload);
        // the status returned is 200 only but valid is false
        expect(res.status).toBe(200);
        expect(res.body.valid).toBe(false);
        expect(res.body.message).toBeDefined();
    })
})