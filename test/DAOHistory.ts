import { time, loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect } from "chai";
import { ethers } from "hardhat";

describe("DAO History", function () {
    async function deployFixture() {
        // Contracts are deployed using the first signer/account by default
        const [owner, otherAccount, otherAccount2, otherAccount3] = await ethers.getSigners();

        // PollCreatorのデプロイ
        const PollCreator = await ethers.getContractFactory("PollCreator");
        const pollCreator = await PollCreator.deploy();
        await pollCreator.deployed();


        // DaoHistoryのデプロイ
        const DaoHistory = await ethers.getContractFactory("DAOHistory");
        const daoHistory = await DaoHistory.deploy(pollCreator.address);
        await daoHistory.deployed();
        console.log("DAOHistory deployed to:", daoHistory.address);

        return { daoHistory, owner, otherAccount, otherAccount2 };
    }

    describe("DAO", function () {
        it("DAO HistoryにDAOを追加することができる", async function () {
            const { daoHistory } = await loadFixture(deployFixture);
            await daoHistory.addDao("test", "projectId", "name", "description", "url", "image");
            const daoInfo = await daoHistory.getDaoInfo("test")
            expect(daoInfo.name).to.equal("name");
        });

        it("同じdaoIdのDAOを追加することはできない", async function () {
            const { daoHistory } = await loadFixture(deployFixture);
            await daoHistory.addDao("test", "projectId", "name", "description", "url", "image");
            await expect(daoHistory.addDao("test", "projectId", "name", "description", "url", "image")).to.be.revertedWith("DAO already exists");
        });
    });

    describe("Project", function () {
        it("DAOにProjectを追加することができる", async function () {
            const { daoHistory } = await loadFixture(deployFixture);
            await daoHistory.addDao("test", "projectId", "name", "description", "url", "image");
            const daoInfo = await daoHistory.getDaoInfo("test")
            expect(daoInfo.projects.length).to.equal(1);

            // Projectを追加
            await daoHistory.addProject("test", "projectId2");
        });

        it("DAOに同じProjectIdを追加することはできない", async function () {
            const { daoHistory } = await loadFixture(deployFixture);
            await daoHistory.addDao("test", "projectId", "name", "description", "url", "image");
            const daoInfo = await daoHistory.getDaoInfo("test")
            expect(daoInfo.projects.length).to.equal(1);

            // Projectを追加
            await expect(daoHistory.addProject("test", "projectId")).to.be.revertedWith("Project already exists");
        });
    });
});