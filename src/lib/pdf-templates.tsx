import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
  Link,
  Font,
} from "@react-pdf/renderer";
import type { ResumeData, TemplateId } from "./types";
import { dateRange } from "@/templates/helpers";

// Register Google Fonts (loaded over the network at render time).
// Falls back gracefully to built-in Helvetica if registration is skipped.
try {
  Font.register({
    family: "Inter",
    fonts: [
      { src: "https://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMa1ZL7.ttf", fontWeight: 400 },
      { src: "https://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMa1ZL7.ttf", fontWeight: 500 },
      { src: "https://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMa25L7.ttf", fontWeight: 700 },
    ],
  });
  Font.register({
    family: "InstrumentSerif",
    fonts: [
      { src: "https://fonts.gstatic.com/s/instrumentserif/v4/jizDREVItHgc8qDIbSTKq4XaRZW7QABjGw.ttf", fontWeight: 400 },
    ],
  });
} catch {
  /* font registration is best-effort */
}

const SANS = "Inter";
const SERIF = "InstrumentSerif";

const sizeMap = { sm: 9.5, md: 10.5, lg: 11.5 } as const;
const lhMap = { tight: 1.35, normal: 1.5, loose: 1.7 } as const;
const gapMap = { tight: 6, normal: 10, loose: 16 } as const;

function getStyles(data: ResumeData) {
  const fs = sizeMap[data.theme.fontSize];
  const lh = lhMap[data.theme.lineHeight];
  const gap = gapMap[data.theme.spacing];
  const headingFont = data.theme.fontFamily === "serif" ? SERIF : SANS;
  const accent = data.theme.accentColor;
  return { fs, lh, gap, headingFont, accent };
}

function Header({ data, centered = false }: { data: ResumeData; centered?: boolean }) {
  const { fs, headingFont, accent } = getStyles(data);
  const contact = [
    data.personal.email,
    data.personal.phone,
    data.personal.address,
    data.personal.website,
    data.personal.linkedin,
    data.personal.github,
  ].filter(Boolean);
  return (
    <View style={{ marginBottom: 14, textAlign: centered ? "center" : "left" }}>
      <View
        style={{
          flexDirection: centered ? "column" : "row",
          alignItems: centered ? "center" : "flex-end",
          justifyContent: "space-between",
        }}
      >
        <View>
          <Text style={{ fontFamily: headingFont, fontSize: headingFont === SERIF ? 32 : 26, color: "#111" }}>
            {data.personal.fullName || " "}
          </Text>
          {data.personal.title ? (
            <Text style={{ fontFamily: SANS, fontSize: fs, color: accent, letterSpacing: 2, marginTop: 3, textTransform: "uppercase" }}>
              {data.personal.title}
            </Text>
          ) : null}
        </View>
        {data.personal.photoUrl && !centered ? (
          <Image src={data.personal.photoUrl} style={{ width: 56, height: 56, borderRadius: 28, objectFit: "cover" }} />
        ) : null}
      </View>
      {contact.length > 0 ? (
        <Text style={{ marginTop: 6, fontSize: fs - 1.5, color: "#555", fontFamily: SANS }}>
          {contact.join("  ·  ")}
        </Text>
      ) : null}
    </View>
  );
}

function SectionTitle({ children, accent, headingFont }: { children: React.ReactNode; accent: string; headingFont: string }) {
  return (
    <Text
      style={{
        fontFamily: headingFont,
        fontSize: headingFont === SERIF ? 16 : 12,
        color: "#111",
        borderBottomWidth: 1,
        borderBottomColor: accent,
        paddingBottom: 2,
        marginBottom: 6,
        textTransform: headingFont === SERIF ? "none" : "uppercase",
        letterSpacing: headingFont === SERIF ? 0 : 1.5,
      }}
    >
      {children}
    </Text>
  );
}

function Bullets({ items, fs, lh }: { items: string[]; fs: number; lh: number }) {
  if (!items.length) return null;
  return (
    <View style={{ marginTop: 2 }}>
      {items.map((it, i) => (
        <View key={i} style={{ flexDirection: "row", marginTop: 1 }}>
          <Text style={{ fontFamily: SANS, fontSize: fs, lineHeight: lh, width: 10 }}>•</Text>
          <Text style={{ fontFamily: SANS, fontSize: fs, lineHeight: lh, flex: 1 }}>{it}</Text>
        </View>
      ))}
    </View>
  );
}

function ExperienceBlock({ data }: { data: ResumeData }) {
  const { fs, lh, gap, headingFont, accent } = getStyles(data);
  if (!data.visibility.experience || data.experience.length === 0) return null;
  return (
    <View style={{ marginBottom: gap }} wrap>
      <SectionTitle accent={accent} headingFont={headingFont}>Experience</SectionTitle>
      {data.experience.map((e) => (
        <View key={e.id} style={{ marginBottom: 8 }} wrap={false}>
          <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
            <Text style={{ fontFamily: SANS, fontSize: fs, fontWeight: 700 }}>
              {e.position}
              <Text style={{ fontWeight: 400, color: "#555" }}>  —  {e.company}</Text>
            </Text>
            <Text style={{ fontFamily: SANS, fontSize: fs - 1, color: "#777" }}>
              {dateRange(e.startDate, e.endDate, e.current)}
            </Text>
          </View>
          {e.description ? (
            <Text style={{ fontFamily: SANS, fontSize: fs, lineHeight: lh, marginTop: 2 }}>{e.description}</Text>
          ) : null}
          <Bullets items={e.achievements.filter(Boolean)} fs={fs} lh={lh} />
        </View>
      ))}
    </View>
  );
}

function ProjectsBlock({ data }: { data: ResumeData }) {
  const { fs, lh, gap, headingFont, accent } = getStyles(data);
  if (!data.visibility.projects || data.projects.length === 0) return null;
  return (
    <View style={{ marginBottom: gap }} wrap>
      <SectionTitle accent={accent} headingFont={headingFont}>Projects</SectionTitle>
      {data.projects.map((p) => (
        <View key={p.id} style={{ marginBottom: 5 }} wrap={false}>
          <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
            <Text style={{ fontFamily: SANS, fontSize: fs, fontWeight: 700 }}>{p.title}</Text>
            <Text style={{ fontFamily: SANS, fontSize: fs - 1, color: "#777" }}>{p.tech}</Text>
          </View>
          {p.description ? (
            <Text style={{ fontFamily: SANS, fontSize: fs, lineHeight: lh }}>{p.description}</Text>
          ) : null}
          {[p.github, p.demo].filter(Boolean).length > 0 ? (
            <Text style={{ fontFamily: SANS, fontSize: fs - 1, color: "#777" }}>
              {[p.github, p.demo].filter(Boolean).join(" · ")}
            </Text>
          ) : null}
        </View>
      ))}
    </View>
  );
}

function EducationBlock({ data }: { data: ResumeData }) {
  const { fs, lh, gap, headingFont, accent } = getStyles(data);
  if (!data.visibility.education || data.education.length === 0) return null;
  return (
    <View style={{ marginBottom: gap }} wrap>
      <SectionTitle accent={accent} headingFont={headingFont}>Education</SectionTitle>
      {data.education.map((ed) => (
        <View key={ed.id} style={{ marginBottom: 4 }} wrap={false}>
          <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
            <Text style={{ fontFamily: SANS, fontSize: fs, fontWeight: 700 }}>{ed.school}</Text>
            <Text style={{ fontFamily: SANS, fontSize: fs - 1, color: "#777" }}>
              {dateRange(ed.startDate, ed.endDate)}
            </Text>
          </View>
          <Text style={{ fontFamily: SANS, fontSize: fs, color: "#444", lineHeight: lh }}>
            {[ed.degree, ed.field].filter(Boolean).join(", ")}
            {ed.gpa ? `  ·  GPA ${ed.gpa}` : ""}
          </Text>
          {ed.description ? (
            <Text style={{ fontFamily: SANS, fontSize: fs - 0.5, color: "#666", lineHeight: lh }}>{ed.description}</Text>
          ) : null}
        </View>
      ))}
    </View>
  );
}

function SkillsBlock({ data, asPills = true }: { data: ResumeData; asPills?: boolean }) {
  const { fs, gap, headingFont, accent } = getStyles(data);
  if (!data.visibility.skills || data.skills.length === 0) return null;
  return (
    <View style={{ marginBottom: gap }} wrap>
      <SectionTitle accent={accent} headingFont={headingFont}>Skills</SectionTitle>
      {asPills ? (
        <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
          {data.skills.map((s) => (
            <Text
              key={s.id}
              style={{
                fontFamily: SANS,
                fontSize: fs - 0.5,
                paddingVertical: 2,
                paddingHorizontal: 6,
                borderWidth: 1,
                borderColor: accent,
                marginRight: 4,
                marginBottom: 4,
              }}
            >
              {s.name}
            </Text>
          ))}
        </View>
      ) : (
        <Text style={{ fontFamily: SANS, fontSize: fs }}>
          {data.skills.map((s) => s.name).join(", ")}
        </Text>
      )}
    </View>
  );
}

function SummaryBlock({ data }: { data: ResumeData }) {
  const { fs, lh, gap, headingFont, accent } = getStyles(data);
  if (!data.visibility.summary || !data.personal.summary) return null;
  return (
    <View style={{ marginBottom: gap }} wrap>
      <SectionTitle accent={accent} headingFont={headingFont}>Summary</SectionTitle>
      <Text style={{ fontFamily: SANS, fontSize: fs, lineHeight: lh }}>{data.personal.summary}</Text>
    </View>
  );
}

function CompactList({
  title,
  items,
  data,
}: {
  title: string;
  items: { id: string; text: string }[];
  data: ResumeData;
}) {
  const { fs, lh, gap, headingFont, accent } = getStyles(data);
  if (!items.length) return null;
  return (
    <View style={{ marginBottom: gap }} wrap>
      <SectionTitle accent={accent} headingFont={headingFont}>{title}</SectionTitle>
      <Bullets items={items.map((i) => i.text)} fs={fs} lh={lh} />
    </View>
  );
}

function CertificationsBlock({ data }: { data: ResumeData }) {
  const { fs, lh, gap, headingFont, accent } = getStyles(data);
  if (!data.visibility.certifications || data.certifications.length === 0) return null;
  return (
    <View style={{ marginBottom: gap }} wrap>
      <SectionTitle accent={accent} headingFont={headingFont}>Certifications</SectionTitle>
      {data.certifications.map((c) => (
        <View key={c.id} style={{ marginBottom: 2 }} wrap={false}>
          <Text style={{ fontFamily: SANS, fontSize: fs, fontWeight: 700, lineHeight: lh }}>{c.name}</Text>
          <Text style={{ fontFamily: SANS, fontSize: fs - 1, color: "#666" }}>
            {[c.issuer, c.date].filter(Boolean).join(" · ")}
          </Text>
        </View>
      ))}
    </View>
  );
}

function LanguagesBlock({ data }: { data: ResumeData }) {
  const { fs, lh, gap, headingFont, accent } = getStyles(data);
  if (!data.visibility.languages || data.languages.length === 0) return null;
  return (
    <View style={{ marginBottom: gap }} wrap>
      <SectionTitle accent={accent} headingFont={headingFont}>Languages</SectionTitle>
      {data.languages.map((l) => (
        <Text key={l.id} style={{ fontFamily: SANS, fontSize: fs, lineHeight: lh }}>
          {l.name} <Text style={{ color: "#666" }}>— {l.proficiency}</Text>
        </Text>
      ))}
    </View>
  );
}

function CustomSectionsBlock({ data }: { data: ResumeData }) {
  if (!data.customSections.length) return null;
  return (
    <>
      {data.customSections.map((cs) => (
        <CompactList key={cs.id} title={cs.title} items={cs.items} data={data} />
      ))}
    </>
  );
}

// ---------- Templates ----------

function ModernDoc({ data }: { data: ResumeData }) {
  return (
    <Page size="A4" style={pageBase}>
      <Header data={data} />
      <SummaryBlock data={data} />
      <ExperienceBlock data={data} />
      <ProjectsBlock data={data} />
      <EducationBlock data={data} />
      <SkillsBlock data={data} />
      <CertificationsBlock data={data} />
      <LanguagesBlock data={data} />
      {data.visibility.achievements ? (
        <CompactList title="Achievements" items={data.achievements} data={data} />
      ) : null}
      {data.visibility.interests && data.interests.length > 0 ? (
        <View style={{ marginBottom: getStyles(data).gap }} wrap>
          <SectionTitle accent={data.theme.accentColor} headingFont={getStyles(data).headingFont}>Interests</SectionTitle>
          <Text style={{ fontFamily: SANS, fontSize: getStyles(data).fs }}>
            {data.interests.map((i) => i.text).join(" · ")}
          </Text>
        </View>
      ) : null}
      <CustomSectionsBlock data={data} />
    </Page>
  );
}

function AtsDoc({ data }: { data: ResumeData }) {
  // ATS-optimized: single column, no colors, no pills.
  const { fs, lh, gap, accent } = getStyles(data);
  const headingFont = SANS;
  return (
    <Page size="A4" style={{ ...pageBase, paddingHorizontal: 50 }}>
      <Text style={{ fontFamily: SANS, fontSize: 20, fontWeight: 700, textTransform: "uppercase", letterSpacing: 2 }}>
        {data.personal.fullName}
      </Text>
      {data.personal.title ? (
        <Text style={{ fontFamily: SANS, fontSize: fs + 0.5, marginTop: 2 }}>{data.personal.title}</Text>
      ) : null}
      <Text style={{ fontFamily: SANS, fontSize: fs - 1, marginTop: 3, color: "#222" }}>
        {[data.personal.email, data.personal.phone, data.personal.address, data.personal.linkedin, data.personal.github, data.personal.website]
          .filter(Boolean)
          .join(" | ")}
      </Text>
      <View style={{ borderBottomWidth: 1, borderBottomColor: "#000", marginVertical: 8 }} />
      <SummaryBlock data={data} />
      <ExperienceBlock data={data} />
      <EducationBlock data={data} />
      <SkillsBlock data={data} asPills={false} />
      <ProjectsBlock data={data} />
      <CertificationsBlock data={data} />
      <LanguagesBlock data={data} />
      <CustomSectionsBlock data={data} />
    </Page>
  );
}

function MinimalDoc({ data }: { data: ResumeData }) {
  const { fs, lh, accent } = getStyles(data);
  return (
    <Page size="A4" style={pageBase}>
      <Header data={data} centered />
      <View style={{ alignItems: "center", marginBottom: 12 }}>
        <View style={{ width: 60, height: 1.5, backgroundColor: accent }} />
      </View>
      {data.visibility.summary && data.personal.summary ? (
        <Text
          style={{
            fontFamily: SERIF,
            fontSize: fs + 1,
            fontStyle: "italic",
            textAlign: "center",
            marginBottom: 14,
            lineHeight: lh,
            maxWidth: 420,
            marginHorizontal: "auto",
          }}
        >
          {data.personal.summary}
        </Text>
      ) : null}
      <ExperienceBlock data={data} />
      <EducationBlock data={data} />
      <SkillsBlock data={data} />
      <ProjectsBlock data={data} />
      <CustomSectionsBlock data={data} />
    </Page>
  );
}

function SidebarDoc({ data }: { data: ResumeData }) {
  const { fs, lh, accent } = getStyles(data);
  return (
    <Page size="A4" style={{ padding: 0, fontFamily: SANS, fontSize: fs }}>
      <View style={{ flexDirection: "row", minHeight: "100%" }}>
        <View style={{ width: "34%", backgroundColor: "#1a1a1a", color: "#f5f5f5", padding: 24 }}>
          {data.personal.photoUrl ? (
            <Image src={data.personal.photoUrl} style={{ width: 80, height: 80, borderRadius: 40, marginBottom: 12 }} />
          ) : null}
          <Text style={{ fontFamily: SERIF, fontSize: 22, color: "#fff", lineHeight: 1.1 }}>{data.personal.fullName}</Text>
          {data.personal.title ? (
            <Text style={{ fontSize: fs, color: accent, marginTop: 4 }}>{data.personal.title}</Text>
          ) : null}
          <Text style={{ fontSize: fs - 1, color: accent, marginTop: 16, textTransform: "uppercase", letterSpacing: 1.5 }}>Contact</Text>
          <View style={{ marginTop: 4 }}>
            {[data.personal.email, data.personal.phone, data.personal.address, data.personal.website, data.personal.linkedin, data.personal.github]
              .filter(Boolean)
              .map((x, i) => (
                <Text key={i} style={{ fontSize: fs - 0.5, color: "#ddd", marginBottom: 2, lineHeight: lh }}>
                  {x}
                </Text>
              ))}
          </View>
          {data.visibility.skills && data.skills.length > 0 ? (
            <>
              <Text style={{ fontSize: fs - 1, color: accent, marginTop: 14, textTransform: "uppercase", letterSpacing: 1.5 }}>Skills</Text>
              <View style={{ marginTop: 4 }}>
                {data.skills.map((s) => (
                  <View key={s.id} style={{ marginBottom: 4 }}>
                    <Text style={{ fontSize: fs - 0.5, color: "#eee" }}>{s.name}</Text>
                    <View style={{ height: 2, backgroundColor: "#444", marginTop: 2 }}>
                      <View style={{ width: `${s.level * 20}%`, height: "100%", backgroundColor: accent }} />
                    </View>
                  </View>
                ))}
              </View>
            </>
          ) : null}
          {data.visibility.languages && data.languages.length > 0 ? (
            <>
              <Text style={{ fontSize: fs - 1, color: accent, marginTop: 14, textTransform: "uppercase", letterSpacing: 1.5 }}>Languages</Text>
              <View style={{ marginTop: 4 }}>
                {data.languages.map((l) => (
                  <Text key={l.id} style={{ fontSize: fs - 0.5, color: "#ddd", lineHeight: lh }}>
                    {l.name} — {l.proficiency}
                  </Text>
                ))}
              </View>
            </>
          ) : null}
        </View>
        <View style={{ flex: 1, padding: 28 }}>
          <SummaryBlock data={data} />
          <ExperienceBlock data={data} />
          <EducationBlock data={data} />
          <ProjectsBlock data={data} />
          <CertificationsBlock data={data} />
          <CustomSectionsBlock data={data} />
        </View>
      </View>
    </Page>
  );
}

function ExecutiveDoc({ data }: { data: ResumeData }) {
  const { fs, lh, accent } = getStyles(data);
  return (
    <Page size="A4" style={pageBase}>
      <View style={{ borderBottomWidth: 3, borderBottomColor: accent, paddingBottom: 8, marginBottom: 12 }}>
        <Text style={{ fontFamily: SERIF, fontSize: 36, color: "#111" }}>{data.personal.fullName}</Text>
        <Text style={{ fontFamily: SANS, fontSize: fs + 1, color: accent, textTransform: "uppercase", letterSpacing: 3, marginTop: 2 }}>
          {data.personal.title}
        </Text>
        <Text style={{ fontFamily: SANS, fontSize: fs - 1, color: "#555", marginTop: 6 }}>
          {[data.personal.email, data.personal.phone, data.personal.address, data.personal.linkedin, data.personal.website].filter(Boolean).join("  ·  ")}
        </Text>
      </View>
      <SummaryBlock data={data} />
      <ExperienceBlock data={data} />
      <EducationBlock data={data} />
      <SkillsBlock data={data} />
      <ProjectsBlock data={data} />
      <CertificationsBlock data={data} />
      <LanguagesBlock data={data} />
      <CustomSectionsBlock data={data} />
    </Page>
  );
}

const pageBase = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: SANS,
    fontSize: 10.5,
    color: "#111",
  },
}).page;

const DOCS: Record<TemplateId, (props: { data: ResumeData }) => React.ReactElement> = {
  modern: ModernDoc,
  ats: AtsDoc,
  minimal: MinimalDoc,
  sidebar: SidebarDoc,
  executive: ExecutiveDoc,
};

export function ResumeDocument({ data }: { data: ResumeData }) {
  const Tpl = DOCS[data.template] ?? ModernDoc;
  return (
    <Document
      title={`${data.personal.fullName || "Resume"} — ${data.name}`}
      author={data.personal.fullName}
      subject="Resume"
      creator="ResumeForge AI"
    >
      <Tpl data={data} />
    </Document>
  );
}
