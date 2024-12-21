import { describe, it, expect } from "vitest";
import { Cl } from "@stacks/transactions";

const accounts = simnet.getAccounts();
const deployer = accounts.get("deployer")!;
const wallet1 = accounts.get("wallet_1")!;
const wallet2 = accounts.get("wallet_2")!;

describe("stxmicrosponsor", () => {
  it("deployer can add administrator", () => {
    const { result } = simnet.callPublicFn(
      "stxmicrosponsor",
      "add-administrator",
      [Cl.standardPrincipal(wallet1)],
      deployer
    );
    expect(result).toBeOk(Cl.bool(true));
  });

  it("non-admin cannot add administrator", () => {
    const { result } = simnet.callPublicFn(
      "stxmicrosponsor",
      "add-administrator",
      [Cl.standardPrincipal(wallet2)],
      wallet1
    );
    expect(result).toBeErr(Cl.uint(1000));
  });

  it("admin can register institution", () => {
    simnet.callPublicFn(
      "stxmicrosponsor",
      "add-administrator",
      [Cl.standardPrincipal(deployer)],
      deployer
    );

    const { result } = simnet.callPublicFn(
      "stxmicrosponsor",
      "register-institution",
      [
        Cl.stringAscii("Test University"),
        Cl.stringAscii("https://testuni.edu"),
        Cl.stringAscii("admin@testuni.edu"),
        Cl.stringAscii("accredited"),
      ],
      deployer
    );
    expect(result).toBeOk(Cl.bool(true));
  });

  it("student can register with verified institution", () => {
    simnet.callPublicFn(
      "stxmicrosponsor",
      "add-administrator",
      [Cl.standardPrincipal(deployer)],
      deployer
    );
    simnet.callPublicFn(
      "stxmicrosponsor",
      "register-institution",
      [
        Cl.stringAscii("Test University"),
        Cl.stringAscii("https://testuni.edu"),
        Cl.stringAscii("admin@testuni.edu"),
        Cl.stringAscii("accredited"),
      ],
      deployer
    );

    const { result } = simnet.callPublicFn(
      "stxmicrosponsor",
      "register-student",
      [
        Cl.stringAscii("John Doe"),
        Cl.stringAscii("Test University"),
        Cl.standardPrincipal(wallet2),
        Cl.stringAscii("Computer Science"),
        Cl.uint(2024),
      ],
      wallet1
    );
    expect(result).toBeOk(Cl.bool(true));
  });

  it("cannot register with unverified institution", () => {
    const { result } = simnet.callPublicFn(
      "stxmicrosponsor",
      "register-student",
      [
        Cl.stringAscii("Jane Doe"),
        Cl.stringAscii("Fake University"),
        Cl.standardPrincipal(wallet2),
        Cl.stringAscii("Engineering"),
        Cl.uint(2024),
      ],
      wallet1
    );
    expect(result).toBeErr(Cl.uint(1203));
  });

  it("admin can verify student", () => {
    simnet.callPublicFn(
      "stxmicrosponsor",
      "add-administrator",
      [Cl.standardPrincipal(deployer)],
      deployer
    );
    simnet.callPublicFn(
      "stxmicrosponsor",
      "register-institution",
      [
        Cl.stringAscii("Test University"),
        Cl.stringAscii("https://testuni.edu"),
        Cl.stringAscii("admin@testuni.edu"),
        Cl.stringAscii("accredited"),
      ],
      deployer
    );
    simnet.callPublicFn(
      "stxmicrosponsor",
      "register-student",
      [
        Cl.stringAscii("John Doe"),
        Cl.stringAscii("Test University"),
        Cl.standardPrincipal(wallet2),
        Cl.stringAscii("Computer Science"),
        Cl.uint(2024),
      ],
      wallet1
    );

    const { result } = simnet.callPublicFn(
      "stxmicrosponsor",
      "verify-student",
      [Cl.standardPrincipal(wallet1)],
      deployer
    );
    expect(result).toBeOk(Cl.bool(true));
  });

  it("can read student info", () => {
    simnet.callPublicFn(
      "stxmicrosponsor",
      "add-administrator",
      [Cl.standardPrincipal(deployer)],
      deployer
    );
    simnet.callPublicFn(
      "stxmicrosponsor",
      "register-institution",
      [
        Cl.stringAscii("Test University"),
        Cl.stringAscii("https://testuni.edu"),
        Cl.stringAscii("admin@testuni.edu"),
        Cl.stringAscii("accredited"),
      ],
      deployer
    );
    simnet.callPublicFn(
      "stxmicrosponsor",
      "register-student",
      [
        Cl.stringAscii("John Doe"),
        Cl.stringAscii("Test University"),
        Cl.standardPrincipal(wallet2),
        Cl.stringAscii("Computer Science"),
        Cl.uint(2024),
      ],
      wallet1
    );

    const info = simnet.callReadOnlyFn(
      "stxmicrosponsor",
      "get-student-info",
      [Cl.standardPrincipal(wallet1)],
      deployer
    );
    expect(info.result).toBeSome(
      Cl.tuple({
        name: Cl.stringAscii("John Doe"),
        institution: Cl.stringAscii("Test University"),
        "total-received": Cl.uint(0),
        status: Cl.stringAscii("pending"),
        "milestones-completed": Cl.uint(0),
        verified: Cl.bool(false),
        "verification-time": Cl.uint(0),
        "verification-admin": Cl.standardPrincipal(deployer),
        "last-activity": Cl.uint(4),
        "academic-year": Cl.uint(2024),
        program: Cl.stringAscii("Computer Science"),
      })
    );
  });

  it("contract status returns true by default", () => {
    const status = simnet.callReadOnlyFn(
      "stxmicrosponsor",
      "get-contract-status",
      [],
      deployer
    );
    expect(status.result).toBeBool(true);
  });

  it("admin can pause and resume contract", () => {
    simnet.callPublicFn(
      "stxmicrosponsor",
      "add-administrator",
      [Cl.standardPrincipal(deployer)],
      deployer
    );

    simnet.callPublicFn(
      "stxmicrosponsor",
      "pause-contract",
      [],
      deployer
    );

    let status = simnet.callReadOnlyFn(
      "stxmicrosponsor",
      "get-contract-status",
      [],
      deployer
    );
    expect(status.result).toBeBool(false);

    simnet.callPublicFn(
      "stxmicrosponsor",
      "resume-contract",
      [],
      deployer
    );

    status = simnet.callReadOnlyFn(
      "stxmicrosponsor",
      "get-contract-status",
      [],
      deployer
    );
    expect(status.result).toBeBool(true);
  });
});
