"use client";

import { dateFormat } from "@/lib/date";
import { Live, SnsData } from "@/types/type";
import { useCallback, useMemo, useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import SnsIcons from "./SnsIcons";

const qaList = [
  {
    q: "チケットの取り置きってなんですか？",
    a: "事前に名前を伝えておくことで、ライブ当日に受付でチケット代を支払って入場できる仕組みです。前売り券の代わりのようなものです。",
  },
  {
    q: "ライブ当日、どうすればいいの？",
    a: "会場の受付で「〇〇（バンド名）で取り置きしてます」と伝えてください。その場でチケット代をお支払いすればOKです。",
  },
  {
    q: "名前は本名じゃなくてもいいの？",
    a: "本名じゃなくても大丈夫です。受付で確認しやすいように、SNSの名前など分かりやすい名前でお願いします。",
  },
  {
    q: "急にこれなくなりました。キャンセルの連絡は必要？",
    a: "連絡は不要です。キャンセル料もかかりません。",
  },
  {
    q: "取り置きはしたくないけど、ライブにはいきたい。",
    a: "取り置きしなくても、とりあえずライブ来てくれたらOK。当日券で入れるよ。",
  },
];

const ContactType = { Contact: "1", Ticket: "2" };

type ContactFormProps = {
  isTicket?: boolean;
  defaultScheduleId?: string;
  schedules: Pick<Live, "id" | "eventDetail" | "title">[];
  sns?: SnsData;
};

export function ContactForm({
  isTicket = false,
  defaultScheduleId,
  schedules,
  sns,
}: ContactFormProps) {
  const [contactType, setContactType] = useState(
    isTicket ? ContactType.Ticket : ContactType.Contact
  );
  const [submited, setSubmited] = useState(false);
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const [name, setName] = useState("");
  const [submitedMessage, setSubmitedMessage] = useState("");

  const [contactForm, setContactForm] = useState({ email: "", contents: "" });
  const [ticketForm, setTicketForm] = useState({
    eventId: defaultScheduleId || schedules[0]?.id || "",
    quantity: "1",
    memo: "",
  });

  const isFreeLive = useMemo(() => {
    const schedule = schedules.find((s) => s.id === ticketForm.eventId);
    return (
      contactType === ContactType.Ticket &&
      !schedule?.eventDetail.ticket &&
      !schedule?.eventDetail.todayTicket
    );
  }, [contactType, schedules, ticketForm.eventId]);

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
        setSubmitedMessage("お問い合わせありがとうございました。");
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
      const title = schedule?.title || "";
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
        setSubmitedMessage("取り置きありがとうございました。");
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

  return (
    <div>
      <div className="flex flex-col md:flex-row gap-4 items-start">
        <div className="md:w-1/2 w-full bg-gray-900 rounded-lg p-4 shadow-sm flex flex-col">
          {submited ? (
            <div>{submitedMessage}</div>
          ) : (
            <>
              <h2 className="text-white font-bold text-base mb-4">
                {isTicket
                  ? "ライブチケット取り置き"
                  : "出演依頼や、チケット取り置きなどお気軽にどうぞ～。"}
              </h2>

              {errors.length > 0 && (
                <ul className="mt-2 text-xs text-red-500">
                  {errors.map((e, i) => (
                    <li key={i}>※{e}</li>
                  ))}
                </ul>
              )}

              {/* ラジオボタン */}
              {!isTicket && (
                <div className="flex gap-2 my-4">
                  {Object.entries(ContactType).map(([key, value]) => (
                    <label
                      key={value}
                      className="flex items-center text-white text-sm"
                    >
                      <input
                        type="radio"
                        name="contactType"
                        value={value}
                        checked={contactType === value}
                        onChange={(e) => setContactType(e.target.value)}
                        className="mr-1"
                      />
                      {key === "Contact"
                        ? "お問い合わせ(出演依頼など)"
                        : "チケット取り置き"}
                    </label>
                  ))}
                </div>
              )}
              {/* フォーム部分を完全に分離 */}
              {contactType === ContactType.Contact ? (
                <ContactFormContact
                  name={name}
                  setName={setName}
                  contactForm={contactForm}
                  setContactForm={setContactForm}
                  onSubmit={onSubmit}
                  buttonDisabled={buttonDisabled}
                />
              ) : (
                <ContactFormTicket
                  name={name}
                  setName={setName}
                  ticketForm={ticketForm}
                  setTicketForm={setTicketForm}
                  schedules={schedules}
                  isFreeLive={isFreeLive}
                  onSubmit={onSubmit}
                  buttonDisabled={buttonDisabled}
                />
              )}
            </>
          )}
        </div>

        {sns && (
          <div>
            <div className="mb-5">
              お問い合わせはフォーム、または各種SNSまで
            </div>
            <SnsIcons sns={sns} />
          </div>
        )}
      </div>
      <div>
        {/* FAQ */}
        <div className="max-w-3xl mx-auto mt-8">
          <h2 className="text-xl md:text-3xl font-bold mb-6 text-center">
            取り置きFAQ
          </h2>
          <Accordion type="single" collapsible>
            {qaList.map(({ q, a }, i) => (
              <AccordionItem
                key={i}
                value={`item-${i}`}
                className="border-slate-400"
              >
                <AccordionTrigger className="text-gray-300 font-semibold md:text-lg text-base">
                  {q}
                </AccordionTrigger>
                <AccordionContent className="text-gray-200">
                  {a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </div>
  );
}

// ---------------- 子コンポーネント ----------------
type ContactFormContactProps = {
  name: string;
  setName: React.Dispatch<React.SetStateAction<string>>;
  contactForm: { email: string; contents: string };
  setContactForm: React.Dispatch<
    React.SetStateAction<{ email: string; contents: string }>
  >;
  onSubmit: () => void;
  buttonDisabled: boolean;
};

function ContactFormContact({
  name,
  setName,
  contactForm,
  setContactForm,
  onSubmit,
  buttonDisabled,
}: ContactFormContactProps) {
  return (
    <div>
      <label className="text-white" htmlFor="name">
        お名前
      </label>
      <input
        id="name"
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-full bg-gray-800 rounded-md border-gray-700 text-white px-2 py-1"
      />
      <label className="text-white mt-2 block" htmlFor="email">
        メールアドレス
      </label>
      <input
        id="email"
        type="text"
        value={contactForm.email}
        onChange={(e) =>
          setContactForm((prev) => ({ ...prev, email: e.target.value }))
        }
        className="w-full bg-gray-800 rounded-md border-gray-700 text-white px-2 py-1"
      />
      <label className="text-white mt-2 block" htmlFor="contents">
        お問い合わせ内容
      </label>
      <textarea
        id="contents"
        rows={8}
        value={contactForm.contents}
        onChange={(e) =>
          setContactForm((prev) => ({ ...prev, contents: e.target.value }))
        }
        className="w-full bg-gray-800 rounded-md border-gray-700 text-white px-2 py-1"
      />
      <div className="mt-4 flex justify-end">
        <button
          onClick={onSubmit}
          disabled={buttonDisabled}
          className="bg-white text-black rounded-md px-4 py-1 hover:bg-gray-300 transition-all duration-200 disabled:cursor-not-allowed"
        >
          送信
        </button>
      </div>
    </div>
  );
}

type ContactFormTicketProps = {
  name: string;
  setName: React.Dispatch<React.SetStateAction<string>>;
  ticketForm: { eventId: string; quantity: string; memo: string };
  setTicketForm: React.Dispatch<
    React.SetStateAction<{ eventId: string; quantity: string; memo: string }>
  >;
  schedules: Pick<Live, "id" | "eventDetail" | "title">[];
  isFreeLive: boolean;
  onSubmit: () => void;
  buttonDisabled: boolean;
};

function ContactFormTicket({
  name,
  setName,
  ticketForm,
  setTicketForm,
  schedules,
  isFreeLive,
  onSubmit,
  buttonDisabled,
}: ContactFormTicketProps) {
  return (
    <div>
      <label className="text-white" htmlFor="name">
        お名前
      </label>
      <input
        id="name"
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-full bg-gray-800 rounded-md border-gray-700 text-white px-2 py-1"
      />

      <label className="text-white mt-4 block" htmlFor="event">
        対象のイベント
      </label>
      <select
        id="event"
        value={ticketForm.eventId}
        onChange={(e) =>
          setTicketForm((prev) => ({ ...prev, eventId: e.target.value }))
        }
        className="w-full bg-gray-800 rounded-md border-gray-700 text-white px-2 py-1"
      >
        {schedules.map((s) => (
          <option key={s.id} value={s.id}>
            {dateFormat(s.eventDetail.eventDate)} {s.title}
          </option>
        ))}
      </select>

      {isFreeLive && (
        <div className="text-sm text-red-500 mt-2">
          取り置きできないライブイベントです。
        </div>
      )}

      <label className="text-white mt-4 block" htmlFor="quantity">
        枚数
      </label>
      <select
        id="quantity"
        value={ticketForm.quantity}
        onChange={(e) =>
          setTicketForm((prev) => ({ ...prev, quantity: e.target.value }))
        }
        className="w-full bg-gray-800 rounded-md border-gray-700 text-white px-2 py-1"
      >
        {Array.from({ length: 9 }, (_, i) => i + 1).map((num) => (
          <option key={num} value={num}>
            {num}
          </option>
        ))}
      </select>

      <label className="text-white mt-4 block" htmlFor="memo">
        備考
      </label>
      <textarea
        id="memo"
        rows={4}
        value={ticketForm.memo}
        onChange={(e) =>
          setTicketForm((prev) => ({ ...prev, memo: e.target.value }))
        }
        className="w-full bg-gray-800 rounded-md border-gray-700 text-white px-2 py-1"
      />

      <div className="mt-4 flex justify-end">
        <button
          onClick={onSubmit}
          disabled={buttonDisabled || isFreeLive}
          className="bg-white text-black rounded-md px-4 py-1 hover:bg-gray-300 transition-all duration-200 disabled:cursor-not-allowed"
        >
          送信
        </button>
      </div>
    </div>
  );
}
