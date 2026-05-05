import React, { useEffect, useState } from "react";
import { getDatabase, ref, onValue } from "firebase/database";
import { FaBullhorn } from "react-icons/fa";
import app from "../../AdminRedesign/NewApplicationAdmin/firebase";

const rtdb = getDatabase(app);

export default function Notice() {
  const [notice, setNotice] = useState(null);

  useEffect(() => {
    const noticeRef = ref(rtdb, "startupNewReg/Notice");

    const unsubscribe = onValue(noticeRef, (snapshot) => {
      const value = snapshot.val();

      if (typeof value === "string" && value.trim()) {
        setNotice(value.trim());
      } else {
        setNotice(null);
      }
    });

    return () => unsubscribe();
  }, []);

  if (!notice) return null;

  return (
    <div className="mt-4 rounded-[22px] border border-amber-200 bg-amber-50/95 p-4 shadow-sm">
      <div className="flex items-start gap-3">
        <div className="mt-0.5 text-amber-700">
          <FaBullhorn />
        </div>

        <div className="min-w-0">
          <div className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-700">
            Notice
          </div>
          <div className="mt-1 whitespace-pre-line text-sm leading-6 text-amber-900">
            {notice}
          </div>
        </div>
      </div>
    </div>
  );
}