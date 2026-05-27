import React, { useEffect, useState } from "react";
import {
  FaBell,
  FaExternalLinkAlt,
  FaExclamationTriangle,
  FaInfoCircle,
} from "react-icons/fa";
import { doc, getDoc } from "firebase/firestore";

import { db } from "../../AdminRedesign/NewApplicationAdmin/firebase";
import { SSU_DEV_MODE } from "../ssuDevMode";
import { ssuDocPath } from "./ssuFirebasePaths";

const fallbackNotice = {
  active: true,
  notice:
    "Please complete all steps carefully. Application must be finally submitted after payment.",
  link: "",
  color: "blue",
};

const colorMap = {
  blue: {
    box: "border-blue-100 bg-blue-50 text-blue-800",
    icon: "text-blue-600",
    link: "text-blue-700",
  },
  amber: {
    box: "border-amber-100 bg-amber-50 text-amber-800",
    icon: "text-amber-600",
    link: "text-amber-700",
  },
  red: {
    box: "border-red-100 bg-red-50 text-red-800",
    icon: "text-red-600",
    link: "text-red-700",
  },
  green: {
    box: "border-emerald-100 bg-emerald-50 text-emerald-800",
    icon: "text-emerald-600",
    link: "text-emerald-700",
  },
  slate: {
    box: "border-slate-100 bg-slate-50 text-slate-800",
    icon: "text-slate-600",
    link: "text-slate-700",
  },
};

function getIcon(color) {
  if (color === "red" || color === "amber") return <FaExclamationTriangle />;
  if (color === "green") return <FaBell />;
  return <FaInfoCircle />;
}

export default function Notice() {
  const [notice, setNotice] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const loadNotice = async () => {
      try {
        if (SSU_DEV_MODE) {
          if (mounted) setNotice(fallbackNotice);
          return;
        }

        const snap = await getDoc(doc(db, ...ssuDocPath.settingNotice()));

        if (!mounted) return;

        if (!snap.exists()) {
          setNotice(fallbackNotice);
          return;
        }

        const data = snap.data();

        if (data?.active === false) {
          setNotice(null);
          return;
        }

        setNotice({
          active: data?.active !== false,
          notice: data?.notice || data?.message || fallbackNotice.notice,
          link: data?.link || "",
          color: data?.color || "blue",
        });
      } catch (error) {
        console.error("Failed to load SSU notice", error);
        if (mounted) setNotice(fallbackNotice);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    loadNotice();

    return () => {
      mounted = false;
    };
  }, []);

  if (loading || !notice?.active || !notice?.notice) return null;

  const colors = colorMap[notice.color] || colorMap.blue;

  return (
    <div className={`mt-4 rounded-[22px] border px-4 py-3 text-sm ${colors.box}`}>
      <div className="flex items-start gap-3">
        <span className={`mt-0.5 shrink-0 ${colors.icon}`}>
          {getIcon(notice.color)}
        </span>

        <div className="min-w-0 flex-1">
          <div className="font-semibold">Important Notice</div>

          <div className="mt-1 leading-relaxed">{notice.notice}</div>

          {notice.link ? (
            <a
              href={notice.link}
              target="_blank"
              rel="noreferrer"
              className={`mt-2 inline-flex items-center gap-2 text-xs font-semibold underline ${colors.link}`}
            >
              View Details
              <FaExternalLinkAlt size={10} />
            </a>
          ) : null}
        </div>
      </div>
    </div>
  );
}