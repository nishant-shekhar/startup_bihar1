-- CreateTable
CREATE TABLE `Admin` (
    `id` VARCHAR(191) NOT NULL,
    `admin_id` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Admin_admin_id_key`(`admin_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `User` (
    `_id` VARCHAR(191) NOT NULL,
    `user_id` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `registration_no` VARCHAR(191) NOT NULL,
    `company_name` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `User_user_id_key`(`user_id`),
    UNIQUE INDEX `User_registration_no_key`(`registration_no`),
    PRIMARY KEY (`_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Document` (
    `_id` VARCHAR(191) NOT NULL,
    `logoName` VARCHAR(191) NOT NULL,
    `logoPath` VARCHAR(191) NOT NULL,
    `certName` VARCHAR(191) NOT NULL,
    `certPath` VARCHAR(191) NOT NULL,
    `registrationNo` VARCHAR(191) NOT NULL,
    `founderName` VARCHAR(191) NOT NULL,
    `founderAadharNumber` VARCHAR(191) NOT NULL,
    `coFounderNames` VARCHAR(191) NOT NULL,
    `coFounderAadharNumbers` VARCHAR(191) NOT NULL,
    `sector` VARCHAR(191) NOT NULL,
    `businessConcept` VARCHAR(191) NOT NULL,
    `mobileNumbers` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `websiteLink` VARCHAR(191) NULL,
    `category` VARCHAR(191) NOT NULL,
    `gender` VARCHAR(191) NOT NULL,
    `dpiitRecognitionNo` VARCHAR(191) NULL,
    `appliedIPR` BOOLEAN NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `documentStatus` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Document_registrationNo_key`(`registrationNo`),
    UNIQUE INDEX `Document_userId_key`(`userId`),
    PRIMARY KEY (`_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SeedFund` (
    `_id` VARCHAR(191) NOT NULL,
    `companyName` VARCHAR(191) NOT NULL,
    `registrationNumber` VARCHAR(191) NOT NULL,
    `dateOfIncorporation` DATETIME(3) NOT NULL,
    `businessEntityType` VARCHAR(191) NOT NULL,
    `companyCertificate` VARCHAR(191) NULL,
    `rocDistrict` VARCHAR(191) NOT NULL,
    `companyAddress` VARCHAR(191) NOT NULL,
    `pincode` VARCHAR(191) NOT NULL,
    `bankName` VARCHAR(191) NOT NULL,
    `ifscCode` VARCHAR(191) NOT NULL,
    `currentAccountNumber` VARCHAR(191) NOT NULL,
    `currentAccountHolderName` VARCHAR(191) NOT NULL,
    `branchName` VARCHAR(191) NOT NULL,
    `branchAddress` VARCHAR(191) NOT NULL,
    `cancelChequeOrPassbook` VARCHAR(191) NULL,
    `panNumber` VARCHAR(191) NOT NULL,
    `gstNumber` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `documentStatus` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `SeedFund_userId_key`(`userId`),
    PRIMARY KEY (`_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SecondTranche` (
    `_id` VARCHAR(191) NOT NULL,
    `utilizationCertificate` VARCHAR(191) NULL,
    `statusReport` VARCHAR(191) NULL,
    `expenditurePlan` VARCHAR(191) NULL,
    `bankStatement` VARCHAR(191) NULL,
    `expenditureInvoice` VARCHAR(191) NULL,
    `geoTaggedPhotos` VARCHAR(191) NULL,
    `userId` VARCHAR(191) NOT NULL,
    `documentStatus` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `SecondTranche_userId_key`(`userId`),
    PRIMARY KEY (`_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PostSeedFund` (
    `_id` VARCHAR(191) NOT NULL,
    `currentStage` VARCHAR(191) NOT NULL,
    `technicalKnowledge` BOOLEAN NOT NULL,
    `auditedBalanceSheet` VARCHAR(191) NULL,
    `gstReturn` VARCHAR(191) NULL,
    `raisedFunds` BOOLEAN NOT NULL,
    `employment` BOOLEAN NOT NULL,
    `projectReport` VARCHAR(191) NULL,
    `userId` VARCHAR(191) NOT NULL,
    `documentStatus` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `PostSeedFund_userId_key`(`userId`),
    PRIMARY KEY (`_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `QReport` (
    `_id` VARCHAR(191) NOT NULL,
    `currentStage` VARCHAR(191) NOT NULL,
    `averageTurnover` DOUBLE NOT NULL,
    `currentRevenue` DOUBLE NOT NULL,
    `netProfitOrLoss` VARCHAR(191) NOT NULL,
    `fundRaised` BOOLEAN NOT NULL,
    `workOrders` INTEGER NOT NULL,
    `directEmployment` INTEGER NOT NULL,
    `indirectEmployment` INTEGER NOT NULL,
    `maleEmployees` INTEGER NOT NULL,
    `femaleEmployees` INTEGER NOT NULL,
    `partnerships` VARCHAR(191) NOT NULL,
    `nextQuarterGoals` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `documentStatus` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `QReport_userId_key`(`userId`),
    PRIMARY KEY (`_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `AccelerationProgram` (
    `_id` VARCHAR(191) NOT NULL,
    `hostInstitute` VARCHAR(191) NOT NULL,
    `programName` VARCHAR(191) NOT NULL,
    `startDate` DATETIME(3) NOT NULL,
    `endDate` DATETIME(3) NOT NULL,
    `programWebsite` VARCHAR(191) NULL,
    `founderName` VARCHAR(191) NOT NULL,
    `coFounderName` VARCHAR(191) NULL,
    `participationFee` DOUBLE NOT NULL,
    `travelAccommodationCost` DOUBLE NOT NULL,
    `totalPersons` INTEGER NOT NULL,
    `totalFee` DOUBLE NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `documentStatus` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `AccelerationProgram_userId_key`(`userId`),
    PRIMARY KEY (`_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `MatchingLoan` (
    `_id` VARCHAR(191) NOT NULL,
    `fundRaised` DOUBLE NOT NULL,
    `investorName` VARCHAR(191) NOT NULL,
    `matchingGrantAmount` DOUBLE NOT NULL,
    `proofOfInvestmentName` VARCHAR(191) NULL,
    `proofOfInvestmentPath` VARCHAR(191) NULL,
    `accountStatementName` VARCHAR(191) NULL,
    `accountStatementPath` VARCHAR(191) NULL,
    `investorUndertakingName` VARCHAR(191) NULL,
    `investorUndertakingPath` VARCHAR(191) NULL,
    `equityDilutionProofName` VARCHAR(191) NULL,
    `equityDilutionProofPath` VARCHAR(191) NULL,
    `utilizationPlanName` VARCHAR(191) NULL,
    `utilizationPlanPath` VARCHAR(191) NULL,
    `boardResolutionName` VARCHAR(191) NULL,
    `boardResolutionPath` VARCHAR(191) NULL,
    `userId` VARCHAR(191) NOT NULL,
    `documentStatus` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `MatchingLoan_userId_key`(`userId`),
    PRIMARY KEY (`_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `IncubationApplication` (
    `_id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `incubationCenter` VARCHAR(191) NOT NULL,
    `status` VARCHAR(191) NOT NULL,
    `documentStatus` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `IncubationApplication_userId_key`(`userId`),
    PRIMARY KEY (`_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `CoWorkingApplication` (
    `_id` VARCHAR(191) NOT NULL,
    `coworkingCenter` VARCHAR(191) NOT NULL,
    `seatNo` VARCHAR(191) NOT NULL,
    `status` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `documentStatus` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `CoWorkingApplication_userId_key`(`userId`),
    PRIMARY KEY (`_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `IPRReimbursement` (
    `_id` VARCHAR(191) NOT NULL,
    `iprType` VARCHAR(191) NOT NULL,
    `iprCertificateFileName` VARCHAR(191) NOT NULL,
    `iprCertificateFilePath` VARCHAR(191) NOT NULL,
    `feePaidForApplicationForm` VARCHAR(191) NOT NULL,
    `feePaidInvoiceFileName` VARCHAR(191) NOT NULL,
    `feePaidInvoiceFilePath` VARCHAR(191) NOT NULL,
    `consultancyFee` VARCHAR(191) NULL,
    `consultancyInvoiceFileName` VARCHAR(191) NULL,
    `consultancyInvoiceFilePath` VARCHAR(191) NULL,
    `userId` VARCHAR(191) NOT NULL,
    `documentStatus` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `IPRReimbursement_userId_key`(`userId`),
    PRIMARY KEY (`_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Document` ADD CONSTRAINT `Document_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`user_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SeedFund` ADD CONSTRAINT `SeedFund_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`user_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SecondTranche` ADD CONSTRAINT `SecondTranche_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`user_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PostSeedFund` ADD CONSTRAINT `PostSeedFund_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`user_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `QReport` ADD CONSTRAINT `QReport_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`user_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AccelerationProgram` ADD CONSTRAINT `AccelerationProgram_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`user_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `MatchingLoan` ADD CONSTRAINT `MatchingLoan_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`user_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `IncubationApplication` ADD CONSTRAINT `IncubationApplication_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`user_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CoWorkingApplication` ADD CONSTRAINT `CoWorkingApplication_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`user_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `IPRReimbursement` ADD CONSTRAINT `IPRReimbursement_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`user_id`) ON DELETE RESTRICT ON UPDATE CASCADE;
