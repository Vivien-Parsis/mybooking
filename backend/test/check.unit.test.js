import { isValidPassword, isValidEmail } from "../services/check.service.js";

describe("Check Service Unit Tests", () => {
    describe("isValidPassword", () => {
        it("should return true for a valid password", () => {
            expect(isValidPassword("password123")).toBe(true);
        });

        it("should return true for a password with exactly 6 characters", () => {
            expect(isValidPassword("123456")).toBe(true);
        });

        it("should return true for a password with exactly 30 characters", () => {
            expect(isValidPassword("a".repeat(30))).toBe(true);
        });

        it("should return false if password is null", () => {
            expect(isValidPassword(null)).toBe(false);
        });

        it("should return false if password is undefined", () => {
            expect(isValidPassword(undefined)).toBe(false);
        });

        it("should return false if password is an empty string", () => {
            expect(isValidPassword("")).toBe(false);
        });

        it("should return false if password is not a string (number)", () => {
            expect(isValidPassword(123456)).toBe(false);
        });

        it("should return false if password is not a string (object)", () => {
            expect(isValidPassword({})).toBe(false);
        });

        it("should return false if password contains spaces", () => {
            expect(isValidPassword("pass word")).toBe(false);
        });

        it("should return false if password is too short (less than 6 characters)", () => {
            expect(isValidPassword("12345")).toBe(false);
        });

        it("should return false if password is too long (more than 30 characters)", () => {
            expect(isValidPassword("a".repeat(31))).toBe(false);
        });
    });

    describe("isValidEmail", () => {
        it("should return true for a valid email", () => {
            expect(isValidEmail("test@test.com")).toBe(true);
        });

        it("should return false if email is null", () => {
            expect(isValidEmail(null)).toBe(false);
        });

        it("should return false if email is undefined", () => {
            expect(isValidEmail(undefined)).toBe(false);
        });

        it("should return false if email is an empty string", () => {
            expect(isValidEmail("")).toBe(false);
        });

        it("should return false if email is not a string (number)", () => {
            expect(isValidEmail(123456)).toBe(false);
        });

        it("should return false if email is not a string (object)", () => {
            expect(isValidEmail({})).toBe(false);
        });

        it("should return false if email missing @", () => {
            expect(isValidEmail("testtest.com")).toBe(false);
        });

        it("should return false if email missing domain extension", () => {
            expect(isValidEmail("test@test")).toBe(false);
        });

        it("should return false if email has spaces", () => {
            expect(isValidEmail("test @test.com")).toBe(false);
        });
    });
});
