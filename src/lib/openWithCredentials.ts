import { toast } from "sonner"

function copyTextSync(value: string): boolean {
  const el = document.createElement("textarea")
  el.value = value
  el.setAttribute("readonly", "")
  el.style.position = "fixed"
  el.style.top = "0"
  el.style.left = "0"
  el.style.opacity = "0"
  document.body.appendChild(el)
  el.focus()
  el.select()
  el.setSelectionRange(0, value.length)
  let ok = false
  try {
    ok = document.execCommand("copy")
  } catch {
    ok = false
  }
  document.body.removeChild(el)
  return ok
}

async function copyText(value: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(value)
    return true
  } catch {
    return copyTextSync(value)
  }
}

/** Opens an interface URL and stages credentials for quick paste (cross-origin autofill is blocked by browsers). */
export async function openWithCredentials(input: {
  url: string
  username?: string | null
  password?: string | null
}) {
  const url = input.url.trim()
  if (!url) return

  const username = input.username?.trim() ?? ""
  const password = input.password ?? ""

  // Copy BEFORE window.open — opening a tab steals focus and can break clipboard permission.
  let copiedUsername = false
  if (username) {
    copiedUsername = await copyText(username)
  } else if (password) {
    await copyText(password)
  }

  window.open(url, "_blank", "noopener,noreferrer")

  if (!username && !password) {
    toast.message("تم فتح الرابط بدون بيانات دخول محفوظة.")
    return
  }

  if (username && password) {
    toast.success(copiedUsername ? "تم فتح الرابط ونسخ اسم المستخدم" : "تم فتح الرابط", {
      description: copiedUsername
        ? "الصقه في حقل المستخدم، ثم انسخ كلمة المرور."
        : "انسخ اسم المستخدم وكلمة المرور يدوياً من القائمة.",
      duration: 15_000,
      action: {
        label: "نسخ كلمة المرور",
        onClick: () => {
          void copyText(password).then((ok) => {
            if (ok) toast.success("تم نسخ كلمة المرور")
            else toast.error("تعذّر نسخ كلمة المرور")
          })
        },
      },
    })
    return
  }

  if (username) {
    toast.success(copiedUsername ? "تم فتح الرابط ونسخ اسم المستخدم" : "تم فتح الرابط")
    return
  }

  toast.success("تم فتح الرابط ونسخ كلمة المرور")
}
