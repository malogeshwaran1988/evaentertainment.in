"use client";

import { useEffect, useRef } from "react";
import { Theme } from "@radix-ui/themes";
import { RichTextEditor } from "@templatepix/text-editor";
import "@radix-ui/themes/styles.css";
import "@templatepix/text-editor/styles.css";
import { useThemeMode } from "@@/components/admin/theme/AdminThemeProvider";

export type BlogEditorProps = {
  value: string;
  onChange: (html: string) => void;
  /** Uploads an image and returns its public URL. */
  onImageUpload: (file: File) => Promise<string>;
  labelledBy: string;
  describedBy?: string;
  invalid?: boolean;
  disabled?: boolean;
};

/** Brand palette for the editor chrome; dark-on-green and green-on-dark meet AA (see admin.css). */
const PALETTE = {
  light: {
    "--accent-primary": "#3d6e0a",
    "--accent-secondary": "#3d6e0a",
    "--focus-ring": "#3d6e0a",
  },
  dark: {
    "--accent-primary": "#abee2d",
    "--accent-secondary": "#abee2d",
    "--focus-ring": "#abee2d",
    "--text-primary": "#fafafa",
    "--text-secondary": "#d4d4d8",
    "--bg-primary": "#18181b",
    "--bg-secondary": "#27272a",
    "--border-color": "#52525b",
    "--code-bg": "#27272a",
    "--code-text": "#fafafa",
  },
} as const;

/**
 * The TemplatePix editor inside a Radix Theme (its dialogs and menus need one). Loaded only on
 * the admin blog form, so neither stylesheet reaches the public site.
 */
export default function BlogEditorInner({
  value,
  onChange,
  onImageUpload,
  labelledBy,
  describedBy,
  invalid,
  disabled,
}: BlogEditorProps) {
  const { mode } = useThemeMode();
  const wrap = useRef<HTMLDivElement>(null);

  // The editable area is a contentEditable div with no label of its own: name it after the
  // visible "Article" label and link the hint/error text (WCAG 1.3.1, 4.1.2).
  useEffect(() => {
    const area = wrap.current?.querySelector<HTMLElement>('[contenteditable="true"]');
    if (!area) return;
    area.setAttribute("role", "textbox");
    area.setAttribute("aria-multiline", "true");
    area.setAttribute("aria-labelledby", labelledBy);
    if (describedBy) area.setAttribute("aria-describedby", describedBy);
    if (invalid) area.setAttribute("aria-invalid", "true");
    else area.removeAttribute("aria-invalid");
  });

  return (
    <Theme
      appearance={mode}
      accentColor="lime"
      grayColor="sand"
      radius="medium"
      hasBackground={false}
      style={PALETTE[mode] as React.CSSProperties}
    >
      <div ref={wrap} className="eva-blog-editor">
        <RichTextEditor
          value={value}
          onChange={onChange}
          placeholder="Write the article…"
          height={480}
          disabled={disabled}
          onImageUpload={async (file) => ({ url: await onImageUpload(file), fallback: false })}
        />
      </div>
    </Theme>
  );
}
