"use client";

import { dateFormat } from "@/lib/date";
import { Announce } from "@/types/type";
import { useCallback, useState } from "react";

const ContactType = { Contact: "1", Ticket: "2" };

export function ContactForm({
  defaultScheduleId,
  schedules,
}: {
  defaultScheduleId?: string;
  schedules: Pick<Announce, "id" | "eventDetail" | "title">[];
}) {
  const [contactType, setContactType] = useState(ContactType.Contact);
  const [submited, setSubmited] = useState(false);
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const [name, setName] = useState("");
  const [contactForm, setContactForm] = useState({
    email: "",
    contents: "",
  });

  const [ticketForm, setTicketForm] = useState({
    eventId: defaultScheduleId || schedules[0]?.id || "",
    quantity: "1",
    memo: "",
  });

  const onSubmit = useCallback(async () => {
    setButtonDisabled(true);
    if (contactType === ContactType.Contact) {
      const res = await fetch("/api/contact", {
        method: "POST",
        body: JSON.stringify({ name, ...contactForm }),
        headers: { "Content-Type": "application/json" },
      });

      if (res.ok) {
        setErrors([]);
        setSubmited(true);
      } else {
        const error = (await res.json()) as {
          success: boolean;
          errors: string[];
        };
        setErrors(error.errors);
      }
    }
    if (contactType === ContactType.Ticket) {
      const schedule = schedules.find((s) => s.id === ticketForm.eventId);
      const title = schedule ? schedule.title : "";
      const date = schedule ? dateFormat(schedule.eventDetail.eventDate) : "";
      const quantity = ticketForm.quantity;
      const memo = ticketForm.memo;
      const res = await fetch("/api/ticket", {
        method: "POST",
        body: JSON.stringify({ name, title, date, quantity, memo }),
        headers: { "Content-Type": "application/json" },
      });

      if (res.ok) {
        setErrors([]);
        setSubmited(true);
      } else {
        const error = (await res.json()) as {
          success: boolean;
          errors: string[];
        };
        setErrors(error.errors);
      }
    }
    setButtonDisabled(false);
  }, [contactForm, contactType, name, schedules, ticketForm]);

  if (submited) {
    return (
      <div className="mt-4 flex flex-col bg-gray-900 rounded-lg p-4 shadow-sm">
        {contactType === ContactType.Contact && <p>TODO</p>}
        {contactType === ContactType.Ticket && <p>TODO</p>}
      </div>
    );
  }

  return (
    <div className="mt-4 flex flex-col bg-gray-900 rounded-lg p-4 shadow-sm">
      <h2 className="text-white font-bold text-base">
        出演依頼や、チケット取り置きなどお気軽にどうぞ～。
      </h2>
      {errors.length > 0 && (
        <ul className="mt-4">
          {errors.map((e, i) => (
            <li key={i} className="text-xs text-red-500">
              {e}
            </li>
          ))}
        </ul>
      )}
      <div className="mt-4">
        <div className="flex gap-2">
          <div className="flex items-center">
            <input
              type="radio"
              value={ContactType.Contact}
              name="contctType"
              id="type-contact"
              defaultChecked={contactType === ContactType.Contact}
              onChange={(e) => setContactType(e.target.value)}
            />
            <label className="text-white text-sm ml-1" htmlFor="type-contact">
              お問い合わせ(出演依頼など)
            </label>
          </div>
          <div className="flex items-center">
            <input
              type="radio"
              value={ContactType.Ticket}
              name="contctType"
              id="type-ticket"
              defaultChecked={contactType === ContactType.Ticket}
              onChange={(e) => setContactType(e.target.value)}
            />
            <label className="text-white text-sm ml-1" htmlFor="type-ticket">
              チケット取り置き
            </label>
          </div>
        </div>
      </div>
      <div className="mt-4">
        <label className="text-white" htmlFor="name">
          お名前
        </label>
        <input
          className="w-full bg-gray-800 rounded-md border-gray-700 text-white px-2 py-1"
          type="text"
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      {contactType === ContactType.Contact && (
        <div className="mt-4">
          <div>
            <label className="text-white" htmlFor="email">
              メールアドレス
            </label>
            <input
              className="w-full bg-gray-800 rounded-md border-gray-700 text-white px-2 py-1"
              type="text"
              onChange={(e) =>
                setContactForm((state) => ({ ...state, email: e.target.value }))
              }
            />
          </div>
          <div className="mt-4">
            <label className="text-white" htmlFor="contents">
              お問い合わせ内容
            </label>
            <textarea
              rows={8}
              className="w-full bg-gray-800 rounded-md border-gray-700 text-white px-2 py-1"
              id="contents"
              onChange={(e) =>
                setContactForm((state) => ({
                  ...state,
                  contents: e.target.value,
                }))
              }
            ></textarea>
          </div>
        </div>
      )}
      {contactType === ContactType.Ticket && (
        <div className="mt-4">
          <div>
            <label className="text-white" htmlFor="event">
              対象のイベント
            </label>
            <select
              className="w-full bg-gray-800 rounded-md border-gray-700 text-white px-2 py-1"
              id="event"
              onChange={(e) =>
                setTicketForm((state) => ({
                  ...state,
                  eventId: e.target.value,
                }))
              }
            >
              {schedules.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.title}
                </option>
              ))}
            </select>
          </div>
          {/* TODO チケットが前売り、当日ともに無料の場合は、不要のメッセージ */}
          <div className="mt-4">
            <label className="text-white" htmlFor="quantity">
              枚数
            </label>
            <select
              className="w-full bg-gray-800 rounded-md border-gray-700 text-white px-2 py-1"
              id="quantity"
              onChange={(e) =>
                setTicketForm((state) => ({
                  ...state,
                  quantity: e.target.value,
                }))
              }
            >
              {Array.from({ length: 9 }, (_, i) => (
                <option key={i} value={i + 1}>
                  {i + 1}
                </option>
              ))}
            </select>
          </div>
          <div className="mt-4">
            <label className="text-white" htmlFor="memo">
              備考
            </label>
            <textarea
              rows={4}
              className="w-full bg-gray-800 rounded-md border-gray-700 text-white px-2 py-1"
              id="memo"
              onChange={(e) =>
                setTicketForm((state) => ({
                  ...state,
                  memo: e.target.value,
                }))
              }
            ></textarea>
          </div>
        </div>
      )}

      <div className="mt-4 flex justify-end">
        <button
          onClick={onSubmit}
          disabled={buttonDisabled}
          className="bg-white text-black rounded-md px-4 py-1 hover:bg-gray-300  transition-all duration-200"
        >
          送信
        </button>
      </div>
    </div>
  );
}
