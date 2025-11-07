import { NextResponse } from "next/server";
import validator from "validator";

export async function POST(req: Request) {
  const body = (await req.json()) as {
    title: string;
    date: string;
    quantity: string;
    memo: string;
    name: string;
  };

  // -------- バリデーション --------
  const errors: string[] = [];

  // お名前
  if (!body.name || validator.isEmpty(body.name.trim())) {
    errors.push("お名前は必須です。");
  } else if (!validator.isLength(body.name, { max: 100 })) {
    errors.push("お名前は100文字以内で入力してください。");
  }

  // タイトル
  if (!body.title || validator.isEmpty(body.title.trim())) {
    errors.push("タイトルは必須です。");
  } else if (!validator.isLength(body.title, { max: 1000 })) {
    errors.push("タイトルは1000文字以内で入力してください。");
  }

  // 日付
  if (!body.date || validator.isEmpty(body.date.trim())) {
    errors.push("日付は必須です。");
  } else {
    const dateStr = body.date.trim();

    // validator には日付チェックもある！
    // isDate() は ISO8601 形式(YYYY-MM-DD)対応
    const normalized = dateStr.replace(/\//g, "-"); // YYYY/MM/DD → YYYY-MM-DD に変換
    if (
      !validator.isDate(normalized, { format: "YYYY-MM-DD", strictMode: true })
    ) {
      errors.push(
        "日付の形式が正しくありません（例: 2025-12-20 または 2025/12/20）。"
      );
    }
  }

  if (errors.length > 0) {
    return NextResponse.json({ success: false, errors }, { status: 400 });
  }

  const action = process.env.FORM_TICKET_ACTION || "";
  const fields = {
    name: process.env.FORM_TICKET_FIELD_NAME!,
    dateYear: process.env.FORM_TICKET_FIELD_DATE! + "_year",
    dateMonth: process.env.FORM_TICKET_FIELD_DATE! + "_month",
    dateDay: process.env.FORM_TICKET_FIELD_DATE! + "_day",
    title: process.env.FORM_TICKET_FIELD_TITLE!,
    quantity: process.env.FORM_TICKET_FIELD_QUANTITY!,
    memo: process.env.FORM_TICKET_FIELD_MEMO!,
  };

  const dateParts = body.date.split(/[-/]/);

  const [year, month, day] = dateParts;
  const formData = new URLSearchParams({
    [fields.name]: body.name,
    [fields.dateYear]: year,
    [fields.dateMonth]: month,
    [fields.dateDay]: day,
    [fields.title]: body.title,
    [fields.quantity]: body.quantity,
    [fields.memo]: body.memo ?? "",
  });

  try {
    const res = await fetch(action, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: formData.toString(),
    });

    if (!res.ok) {
      throw new Error(`Googleフォーム送信失敗: ${res.statusText}`);
    }

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Googleフォーム送信中にエラー:", error.message);
      return NextResponse.json(
        { success: false, errors: [error.message] },
        { status: 500 }
      );
    }

    console.error("予期せぬエラー:", error);
    return NextResponse.json(
      { success: false, errors: ["不明なエラーが発生しました。"] },
      { status: 500 }
    );
  }
}
