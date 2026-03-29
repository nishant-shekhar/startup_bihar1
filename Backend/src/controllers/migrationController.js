const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const ADMIN_SELECT = {
  id: true,
  admin_id: true,
  name: true,
  designation: true,
  role: true,
  contact: true,
  createdAt: true,
  updatedAt: true,
};

const USER_SELECT = {
  id: true,
  user_id: true,
  registration_no: true,
  company_name: true,
  about: true,
  createdAt: true,
  email: true,
  facebook: true,
  founder_dp: true,
  founder_name: true,
  instagram: true,
  linkedin: true,
  logo: true,
  mobile: true,
  moto: true,
  registration_year: true,
  startup_since: true,
  twitter: true,
  updatedAt: true,
  website: true,
  topStartup: true,
  category: true,
  coverPic: true,
  employeeCount: true,
  projects: true,
  revenueLY: true,
  status: true,
  workOrders: true,
  matchingLoanAmount: true,
  postSeedAmount: true,
  secondTrancheAmount: true,
  seedFundAmount: true,
  address: true,
  cin: true,
  dateOfIncorporation: true,
  districtRoc: true,
  dpiitCert: true,
};

const TABLE_CONFIG = {
  users: {
    title: "Users",
    collectionName: "users",
    getDocId: (row) => row.user_id,
    fetcher: async () =>
      prisma.user.findMany({
        select: USER_SELECT,
        orderBy: { updatedAt: "desc" },
      }),
  },

  admins: {
    title: "Admins",
    collectionName: "admins",
    getDocId: (row) => row.admin_id,
    fetcher: async () =>
      prisma.admin.findMany({
        select: ADMIN_SELECT,
        orderBy: { updatedAt: "desc" },
      }),
  },

  staff: {
    title: "Staff",
    collectionName: "staff",
    getDocId: (row) => row.id,
    fetcher: async () =>
      prisma.staff.findMany({
        orderBy: [{ rank: "asc" }, { updatedAt: "desc" }],
      }),
  },

  showcase: {
    title: "Showcase",
    collectionName: "showcase",
    getDocId: (row) => row.id,
    fetcher: async () =>
      prisma.showcase.findMany({
        orderBy: { updatedAt: "desc" },
      }),
  },

  startupDocuments: {
    title: "Startup Documents",
    collectionName: "startupDocuments",
    getDocId: (row) => row.userId,
    fetcher: async () =>
      prisma.document.findMany({
        include: {
          user: {
            select: {
              user_id: true,
              registration_no: true,
              company_name: true,
              founder_name: true,
              logo: true,
              mobile: true,
              email: true,
              dateOfIncorporation: true,
              districtRoc: true,
              cin: true,
            },
          },
        },
        orderBy: { updatedAt: "desc" },
      }),
  },

  seedFunds: {
    title: "Seed Funds",
    collectionName: "seedFunds",
    getDocId: (row) => row.userId,
    fetcher: async () =>
      prisma.seedFund.findMany({
        include: {
          user: {
            select: {
              user_id: true,
              registration_no: true,
              company_name: true,
              founder_name: true,
              logo: true,
              mobile: true,
              email: true,
            },
          },
        },
        orderBy: { updatedAt: "desc" },
      }),
  },

  secondTranches: {
    title: "Second Tranches",
    collectionName: "secondTranches",
    getDocId: (row) => row.userId,
    fetcher: async () =>
      prisma.secondTranche.findMany({
        include: {
          user: {
            select: {
              user_id: true,
              registration_no: true,
              company_name: true,
            },
          },
        },
        orderBy: { updatedAt: "desc" },
      }),
  },

  postSeedFunds: {
    title: "Post Seed Funds",
    collectionName: "postSeedFunds",
    getDocId: (row) => row.userId,
    fetcher: async () =>
      prisma.postSeedFund.findMany({
        include: {
          user: {
            select: {
              user_id: true,
              registration_no: true,
              company_name: true,
            },
          },
        },
        orderBy: { updatedAt: "desc" },
      }),
  },

  qReports: {
    title: "Q Reports",
    collectionName: "qReports",
    getDocId: (row) => row.id,
    fetcher: async () =>
      prisma.qReport.findMany({
        include: {
          user: {
            select: {
              id: true,
              user_id: true,
              registration_no: true,
              company_name: true,
            },
          },
        },
        orderBy: { updatedAt: "desc" },
      }),
  },

  accelerationPrograms: {
    title: "Acceleration Programs",
    collectionName: "accelerationPrograms",
    getDocId: (row) => row.userId,
    fetcher: async () =>
      prisma.accelerationProgram.findMany({
        include: {
          user: {
            select: {
              user_id: true,
              registration_no: true,
              company_name: true,
            },
          },
        },
        orderBy: { updatedAt: "desc" },
      }),
  },

  matchingLoans: {
    title: "Matching Loans",
    collectionName: "matchingLoans",
    getDocId: (row) => row.userId,
    fetcher: async () =>
      prisma.matchingLoan.findMany({
        include: {
          user: {
            select: {
              user_id: true,
              registration_no: true,
              company_name: true,
            },
          },
        },
        orderBy: { updatedAt: "desc" },
      }),
  },

  iprReimbursements: {
    title: "IPR Reimbursements",
    collectionName: "iprReimbursements",
    getDocId: (row) => row.userId,
    fetcher: async () =>
      prisma.iPRReimbursement.findMany({
        include: {
          user: {
            select: {
              user_id: true,
              registration_no: true,
              company_name: true,
            },
          },
        },
        orderBy: { updatedAt: "desc" },
      }),
  },

  incubationApplications: {
    title: "Incubation Applications",
    collectionName: "incubationApplications",
    getDocId: (row) => row.userId,
    fetcher: async () =>
      prisma.incubationApplication.findMany({
        include: {
          user: {
            select: {
              user_id: true,
              registration_no: true,
              company_name: true,
            },
          },
        },
        orderBy: { updatedAt: "desc" },
      }),
  },

  coworkingApplications: {
    title: "CoWorking Applications",
    collectionName: "coworkingApplications",
    getDocId: (row) => row.userId,
    fetcher: async () =>
      prisma.coWorking.findMany({
        orderBy: { updatedAt: "desc" },
      }),
  },

  // Optional legacy table if it still exists and you also want it
  coworkingApplicationsLegacy: {
    title: "CoWorking Applications Legacy",
    collectionName: "coworkingApplicationsLegacy",
    getDocId: (row) => row.id,
    fetcher: async () =>
      prisma.coWorkingApplication.findMany({
        orderBy: { updatedAt: "desc" },
      }),
  },

  userNotifications: {
    title: "User Notifications",
    collectionName: "userNotifications",
    getDocId: (row) => row.id,
    fetcher: async () =>
      prisma.userNotification.findMany({
        orderBy: { updatedAt: "desc" },
      }),
  },

  activities: {
    title: "Activities",
    collectionName: "activities",
    getDocId: (row) => row.id,
    fetcher: async () =>
      prisma.activity.findMany({
        orderBy: { timestamp: "desc" },
      }),
  },

  coworkingSeatMap: {
    title: "CoWorking Seat Map",
    collectionName: "coworkingSeatMap",
    getDocId: (row) => row.id,
    fetcher: async () =>
      prisma.coWorkingSeatMap.findMany({
        orderBy: { updatedAt: "desc" },
      }),
  },
};

const getTableConfig = (tableKey) => {
  const config = TABLE_CONFIG[tableKey];
  if (!config) {
    const err = new Error(`Unsupported table key: ${tableKey}`);
    err.statusCode = 400;
    throw err;
  }
  return config;
};

const sanitizeValue = (value) => {
  if (value === undefined) return null;

  if (value instanceof Date) {
    return value.toISOString();
  }

  if (Array.isArray(value)) {
    return value.map((item) => sanitizeValue(item));
  }

  if (value && typeof value === "object") {
    const out = {};
    Object.keys(value).forEach((key) => {
      out[key] = sanitizeValue(value[key]);
    });
    return out;
  }

  return value;
};

const sanitizeRows = (rows = []) => rows.map((row) => sanitizeValue(row));

const getMigrationTables = async (req, res) => {
  try {
    const tables = Object.entries(TABLE_CONFIG).map(([key, cfg]) => ({
      key,
      title: cfg.title,
      collectionName: cfg.collectionName,
    }));

    return res.status(200).json({ tables });
  } catch (error) {
    console.error("getMigrationTables error:", error);
    return res.status(500).json({
      error: "Failed to get migration tables",
    });
  }
};

const fetchMigrationRows = async (req, res) => {
  try {
    const { tableKey } = req.params;
    const config = getTableConfig(tableKey);

    const rows = await config.fetcher();
    const safeRows = sanitizeRows(rows);

    return res.status(200).json({
      tableKey,
      title: config.title,
      collectionName: config.collectionName,
      total: safeRows.length,
      rows: safeRows,
    });
  } catch (error) {
    console.error("fetchMigrationRows error:", error);
    return res.status(error.statusCode || 500).json({
      error: error.message || "Failed to fetch migration rows",
    });
  }
};

module.exports = {
  getMigrationTables,
  fetchMigrationRows,
};