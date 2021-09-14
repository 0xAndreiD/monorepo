-- CreateEnum
CREATE TYPE "TokenType" AS ENUM ('RESET_PASSWORD');

-- CreateEnum
CREATE TYPE "Role" AS ENUM ('AccountExecutive', 'Stakeholder');

-- CreateEnum
CREATE TYPE "LinkType" AS ENUM ('Document', 'WebLink');

-- CreateEnum
CREATE TYPE "EventType" AS ENUM ('LaunchRoadmapLinkOpen', 'NextStepCreate', 'NextStepMarkCompleted', 'NextStepMarkNotCompleted', 'NextStepDelete', 'DocumentApprove', 'DocumentOpen', 'DocumentUpload', 'ProposalApprove', 'ProposalDecline', 'ProposalOpen', 'CreateInternalMessage', 'ProductInfoLinkOpen', 'InviteStakeholder');

-- CreateTable
CREATE TABLE "Portal" (
    "id" SERIAL NOT NULL,
    "customerName" TEXT NOT NULL,
    "customerLogoUrl" TEXT NOT NULL,
    "currentRoadmapStage" INTEGER NOT NULL,
    "proposalHeading" TEXT NOT NULL,
    "proposalSubheading" TEXT NOT NULL,
    "proposalLinkId" INTEGER,
    "vendorId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserPortal" (
    "userId" INTEGER NOT NULL,
    "portalId" INTEGER NOT NULL,
    "role" "Role" NOT NULL,
    "hasStakeholderApproved" BOOLEAN,
    "isPrimaryContact" BOOLEAN,
    "isSecondaryContact" BOOLEAN,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    PRIMARY KEY ("userId","portalId")
);

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "photoUrl" TEXT,
    "hashedPassword" TEXT,
    "role" "Role" NOT NULL DEFAULT E'Stakeholder',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Session" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "expiresAt" TIMESTAMP(3),
    "handle" TEXT NOT NULL,
    "hashedSessionToken" TEXT,
    "antiCSRFToken" TEXT,
    "publicData" TEXT,
    "privateData" TEXT,
    "userId" INTEGER,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Token" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "hashedToken" TEXT NOT NULL,
    "type" "TokenType" NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "sentTo" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Vendor" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "logoUrl" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VendorTeam" (
    "id" SERIAL NOT NULL,
    "vendorId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Stakeholder" (
    "jobTitle" TEXT NOT NULL,
    "userId" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "AccountExecutive" (
    "id" SERIAL NOT NULL,
    "jobTitle" TEXT NOT NULL,
    "vendorTeamId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Link" (
    "id" SERIAL NOT NULL,
    "body" TEXT NOT NULL,
    "href" TEXT NOT NULL,
    "type" "LinkType" NOT NULL,
    "userId" INTEGER NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProductInfoSection" (
    "id" SERIAL NOT NULL,
    "portalId" INTEGER NOT NULL,
    "heading" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProductInfoSectionLink" (
    "id" SERIAL NOT NULL,
    "linkId" INTEGER NOT NULL,
    "productInfoSectionId" INTEGER NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PortalImage" (
    "id" SERIAL NOT NULL,
    "portalId" INTEGER NOT NULL,
    "href" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RoadmapStage" (
    "id" SERIAL NOT NULL,
    "portalId" INTEGER NOT NULL,
    "heading" TEXT NOT NULL,
    "date" TIMESTAMP(3),
    "ctaLinkId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RoadmapStageTask" (
    "id" SERIAL NOT NULL,
    "roadmapStageId" INTEGER NOT NULL,
    "task" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NextStepsTask" (
    "id" SERIAL NOT NULL,
    "portalId" INTEGER NOT NULL,
    "description" TEXT NOT NULL,
    "isCompleted" BOOLEAN NOT NULL DEFAULT false,
    "userId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PortalDocument" (
    "id" SERIAL NOT NULL,
    "portalId" INTEGER NOT NULL,
    "linkId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InternalNote" (
    "id" SERIAL NOT NULL,
    "portalId" INTEGER NOT NULL,
    "message" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Event" (
    "id" SERIAL NOT NULL,
    "type" "EventType" NOT NULL,
    "url" TEXT,
    "ip" TEXT,
    "userAgent" TEXT,
    "linkId" INTEGER,
    "portalId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MagicLink" (
    "id" TEXT NOT NULL,
    "hasClicked" BOOLEAN NOT NULL DEFAULT false,
    "userId" INTEGER NOT NULL,
    "destUrl" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Portal_proposalLinkId_unique" ON "Portal"("proposalLinkId");

-- CreateIndex
CREATE UNIQUE INDEX "User.email_unique" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Session.handle_unique" ON "Session"("handle");

-- CreateIndex
CREATE UNIQUE INDEX "Token.hashedToken_type_unique" ON "Token"("hashedToken", "type");

-- CreateIndex
CREATE UNIQUE INDEX "Vendor.name_unique" ON "Vendor"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Stakeholder.userId_unique" ON "Stakeholder"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "AccountExecutive.userId_unique" ON "AccountExecutive"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "ProductInfoSectionLink_linkId_unique" ON "ProductInfoSectionLink"("linkId");

-- CreateIndex
CREATE UNIQUE INDEX "RoadmapStage_ctaLinkId_unique" ON "RoadmapStage"("ctaLinkId");

-- AddForeignKey
ALTER TABLE "Portal" ADD FOREIGN KEY ("proposalLinkId") REFERENCES "Link"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Portal" ADD FOREIGN KEY ("vendorId") REFERENCES "Vendor"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserPortal" ADD FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserPortal" ADD FOREIGN KEY ("portalId") REFERENCES "Portal"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Token" ADD FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VendorTeam" ADD FOREIGN KEY ("vendorId") REFERENCES "Vendor"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Stakeholder" ADD FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AccountExecutive" ADD FOREIGN KEY ("vendorTeamId") REFERENCES "VendorTeam"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AccountExecutive" ADD FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Link" ADD FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductInfoSection" ADD FOREIGN KEY ("portalId") REFERENCES "Portal"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductInfoSectionLink" ADD FOREIGN KEY ("linkId") REFERENCES "Link"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductInfoSectionLink" ADD FOREIGN KEY ("productInfoSectionId") REFERENCES "ProductInfoSection"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PortalImage" ADD FOREIGN KEY ("portalId") REFERENCES "Portal"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RoadmapStage" ADD FOREIGN KEY ("portalId") REFERENCES "Portal"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RoadmapStage" ADD FOREIGN KEY ("ctaLinkId") REFERENCES "Link"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RoadmapStageTask" ADD FOREIGN KEY ("roadmapStageId") REFERENCES "RoadmapStage"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NextStepsTask" ADD FOREIGN KEY ("portalId") REFERENCES "Portal"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NextStepsTask" ADD FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PortalDocument" ADD FOREIGN KEY ("portalId") REFERENCES "Portal"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PortalDocument" ADD FOREIGN KEY ("linkId") REFERENCES "Link"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InternalNote" ADD FOREIGN KEY ("portalId") REFERENCES "Portal"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InternalNote" ADD FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Event" ADD FOREIGN KEY ("linkId") REFERENCES "Link"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Event" ADD FOREIGN KEY ("portalId") REFERENCES "Portal"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Event" ADD FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
