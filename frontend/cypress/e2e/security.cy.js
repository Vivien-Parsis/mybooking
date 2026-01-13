/* global describe, it, cy, beforeEach, expect */

describe("Security Tests - Authentication", () => {
    const loginUrl = "/login";
    const registerUrl = "/register";
    const homeUrl = "/";

    beforeEach(() => {
        cy.clearLocalStorage();
    });

    describe("Authentication Bypass & Redirection", () => {
        it("should redirect to /login when attempting to access a protected route without a token", () => {
            cy.visit(homeUrl);
            cy.url().should("include", loginUrl);
        });

        it("should redirect to /login when attempting to access /person/reservation without a token", () => {
            cy.visit("/person/reservation");
            cy.url().should("include", loginUrl);
        });
    });

    describe("Input Field Security", () => {
        it("should have type='password' for password fields in Login form", () => {
            cy.visit(loginUrl);
            cy.get('input[name="password"]').should("have.attr", "type", "password");
        });

        it("should have type='password' for both password fields in Register form", () => {
            cy.visit(registerUrl);
            cy.get('input[name="password"]').should("have.attr", "type", "password");
            cy.get('input[name="confirmPassword"]').should("have.attr", "type", "password");
        });

        it("should not execute XSS script when injected into the login email field", () => {
            const alertStub = cy.stub();
            cy.on("window:alert", alertStub);

            cy.visit(loginUrl);
            const xssPayload = "<script>alert('XSS')</script>";
            cy.get('input[name="email"]').type(xssPayload).should("have.value", xssPayload);
            cy.get('button[type="submit"]').click();
            cy.then(() => {
                expect(alertStub).to.not.be.called;
            });
        });

        it("should not execute XSS script when injected into registration fields", () => {
            const alertStub = cy.stub();
            cy.on("window:alert", alertStub);

            cy.visit(registerUrl);
            const xssPayload = "<img src=x onerror=alert('XSS')>";

            cy.get('input[name="firstName"]').type(xssPayload);
            cy.get('input[name="lastName"]').type(xssPayload);

            cy.get('button[type="submit"]').click();

            cy.then(() => {
                expect(alertStub).to.not.be.called;
            });
        });
    });

    describe("Form Validation", () => {
        it("should display an error in Register if passwords do not match", () => {
            cy.visit(registerUrl);
            cy.get('input[name="email"]').type("test@test.com");
            cy.get('input[name="password"]').type("Password123");
            cy.get('input[name="confirmPassword"]').type("Different123");
            cy.get('input[name="firstName"]').type("John");
            cy.get('input[name="lastName"]').type("Doe");

            cy.get('button[type="submit"]').click();
            cy.contains("mot de passes non identiques").should("be.visible");
        });

        it("should display an error in Register for invalid password format", () => {
            cy.visit(registerUrl);
            cy.get('input[name="email"]').type("test@test.com");
            cy.get('input[name="password"]').type("short");
            cy.get('input[name="confirmPassword"]').type("short");
            cy.get('input[name="firstName"]').type("John");
            cy.get('input[name="lastName"]').type("Doe");

            cy.get('button[type="submit"]').click();
            cy.contains("mot de passes non conforme").should("be.visible");
        });
    });

    describe("Error Handling & 404", () => {
        it("should display the 404 error page for non-existent routes", () => {
            cy.visit("/non-existent-page-" + Date.now());
            cy.get(".error404").should("be.visible");
            cy.contains("Error 404 - page not found").should("be.visible");
        });
    });
});
