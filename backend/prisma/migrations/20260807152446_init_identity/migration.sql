-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'analyst',
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Agent" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'submitted',
    "contractAddresses" TEXT NOT NULL,
    "chains" TEXT NOT NULL,
    "website" TEXT NOT NULL,
    "docsUrl" TEXT NOT NULL,
    "xHandle" TEXT,
    "githubUrl" TEXT,
    "launchDate" TIMESTAMP(3) NOT NULL,
    "tokenInfo" TEXT,
    "integrations" TEXT,
    "aiModelsUsed" TEXT,
    "logoUrl" TEXT,
    "ownershipVerified" BOOLEAN NOT NULL DEFAULT false,
    "submittedBy" TEXT NOT NULL,
    "submittedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "processAfter" TIMESTAMP(3),
    "scanIndex" INTEGER NOT NULL DEFAULT 0,
    "selectionRationale" TEXT,

    CONSTRAINT "Agent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SignalSnapshot" (
    "id" TEXT NOT NULL,
    "agentId" TEXT NOT NULL,
    "signalKey" TEXT NOT NULL,
    "value" DOUBLE PRECISION NOT NULL,
    "source" TEXT NOT NULL,
    "collectedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "methodVersion" TEXT NOT NULL,
    "rawPayload" TEXT NOT NULL,

    CONSTRAINT "SignalSnapshot_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Score" (
    "id" TEXT NOT NULL,
    "agentId" TEXT NOT NULL,
    "methodologyVersion" TEXT NOT NULL,
    "hardSignalScores" TEXT NOT NULL,
    "editorialScore" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "confidence" DOUBLE PRECISION NOT NULL DEFAULT 1.0,
    "computedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Score_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Dossier" (
    "id" TEXT NOT NULL,
    "agentId" TEXT NOT NULL,
    "dossierNumber" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "verdict" TEXT NOT NULL,
    "aiDrafted" BOOLEAN NOT NULL DEFAULT true,
    "editorVerified" BOOLEAN NOT NULL DEFAULT false,
    "editorId" TEXT,
    "publishedAt" TIMESTAMP(3),
    "methodologyVersion" TEXT NOT NULL,
    "supersedesId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Dossier_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "KeyAward" (
    "id" TEXT NOT NULL,
    "agentId" TEXT NOT NULL,
    "keyCount" INTEGER NOT NULL,
    "awardedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "revokedAt" TIMESTAMP(3),
    "revocationReason" TEXT,
    "methodologyVersion" TEXT NOT NULL,
    "editorId" TEXT NOT NULL,
    "rationale" TEXT NOT NULL,

    CONSTRAINT "KeyAward_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CommunityRating" (
    "id" TEXT NOT NULL,
    "agentId" TEXT NOT NULL,
    "walletAddress" TEXT NOT NULL,
    "stars" INTEGER NOT NULL,
    "usageProofTx" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CommunityRating_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AgentIdentity" (
    "id" TEXT NOT NULL,
    "agentId" TEXT NOT NULL,
    "chainKey" TEXT NOT NULL,
    "contractAddress" TEXT NOT NULL,
    "addressType" TEXT NOT NULL DEFAULT 'contract',
    "isPrimary" BOOLEAN NOT NULL DEFAULT true,
    "verificationTier" TEXT NOT NULL DEFAULT 'unverified',
    "verificationMethod" TEXT NOT NULL DEFAULT 'none',
    "verifiedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastCheckedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AgentIdentity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AgentLink" (
    "id" TEXT NOT NULL,
    "agentId" TEXT NOT NULL,
    "kind" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "resolves" BOOLEAN NOT NULL DEFAULT false,
    "lastCheckedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "httpStatus" INTEGER,

    CONSTRAINT "AgentLink_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Agent_slug_key" ON "Agent"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Dossier_dossierNumber_key" ON "Dossier"("dossierNumber");

-- CreateIndex
CREATE UNIQUE INDEX "CommunityRating_agentId_walletAddress_key" ON "CommunityRating"("agentId", "walletAddress");

-- CreateIndex
CREATE UNIQUE INDEX "AgentIdentity_agentId_chainKey_contractAddress_key" ON "AgentIdentity"("agentId", "chainKey", "contractAddress");

-- AddForeignKey
ALTER TABLE "SignalSnapshot" ADD CONSTRAINT "SignalSnapshot_agentId_fkey" FOREIGN KEY ("agentId") REFERENCES "Agent"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Score" ADD CONSTRAINT "Score_agentId_fkey" FOREIGN KEY ("agentId") REFERENCES "Agent"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Dossier" ADD CONSTRAINT "Dossier_agentId_fkey" FOREIGN KEY ("agentId") REFERENCES "Agent"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Dossier" ADD CONSTRAINT "Dossier_editorId_fkey" FOREIGN KEY ("editorId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "KeyAward" ADD CONSTRAINT "KeyAward_agentId_fkey" FOREIGN KEY ("agentId") REFERENCES "Agent"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "KeyAward" ADD CONSTRAINT "KeyAward_editorId_fkey" FOREIGN KEY ("editorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CommunityRating" ADD CONSTRAINT "CommunityRating_agentId_fkey" FOREIGN KEY ("agentId") REFERENCES "Agent"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AgentIdentity" ADD CONSTRAINT "AgentIdentity_agentId_fkey" FOREIGN KEY ("agentId") REFERENCES "Agent"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AgentLink" ADD CONSTRAINT "AgentLink_agentId_fkey" FOREIGN KEY ("agentId") REFERENCES "Agent"("id") ON DELETE CASCADE ON UPDATE CASCADE;
