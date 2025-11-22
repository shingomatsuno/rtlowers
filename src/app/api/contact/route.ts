import { NextResponse } from "next/server";
import validator from "validator";

export async function POST(req: Request) {
  const body = (await req.json()) as {
    contents: string;
    email: string;
    name: string;
  };

  // -------- バリデーション --------
  const errors: string[] = [];

  if (!body.name || validator.isEmpty(body.name.trim())) {
    errors.push("お名前は必須です。");
  } else if (!validator.isLength(body.name, { max: 100 })) {
    errors.push("お名前は100文字以内で入力してください。");
  }

  if (!body.email || validator.isEmpty(body.email.trim())) {
    errors.push("メールアドレスは必須です。");
  } else {
    if (!validator.isEmail(body.email)) {
      errors.push("メールアドレスの形式が正しくありません。");
    } else if (!validator.isLength(body.email, { max: 256 })) {
      errors.push("メールアドレスの形式が正しくありません。");
    }
  }

  if (!body.contents || validator.isEmpty(body.contents.trim())) {
    errors.push("お問い合わせ内容を入力してください。");
  } else if (!validator.isLength(body.contents, { max: 10000 })) {
    errors.push("お問い合わせ内容は10000文字以内で入力してください。");
  }

  if (errors.length > 0) {
    return NextResponse.json({ success: false, errors }, { status: 400 });
  }

  const action = process.env.FORM_CONTACT_ACTION || "";
  const fields = {
    name: process.env.FORM_CONTACT_FIELD_NAME!,
    email: process.env.FORM_CONTACT_FIELD_EMAIL!,
    contents: process.env.FORM_CONTACT_FIELD_CONTENTS!,
  };

  const formData = new URLSearchParams({
    [fields.name]: body.name,
    [fields.email]: body.email,
    [fields.contents]: body.contents,
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
