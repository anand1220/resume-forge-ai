import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
  Font,
} from "@react-pdf/renderer";
import type { ResumeData, TemplateId } from "./types";
import { dateRange } from "@/templates/helpers";

// System font fallback: No external network calls, no 404 errors.
const SANS = "Helvetica";
const SERIF = "Times-Roman";

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
          </Text>
        </View>
      ))}
    </View>
  );
}

function SkillsBlock({ data }: { data: ResumeData }) {
  const { fs, gap, headingFont, accent } = getStyles(data);
  if (!data.visibility.skills || data.skills.length === 0) return null;
  return (
    <View style={{ marginBottom: gap }} wrap>
      <SectionTitle accent={accent} headingFont={headingFont}>Skills</SectionTitle>
      <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
        {data.skills.map((s) => (
          <Text key={s.id} style={{ fontFamily: SANS, fontSize: fs - 0.5, padding: 4, borderWidth: 1, borderColor: accent, marginRight: 4, marginBottom: 4 }}>
            {s.name}
          </Text>
        ))}
      </View>
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

function CertificationsBlock({ data }: { data: ResumeData }) {
  const { fs, lh, gap, headingFont, accent } = getStyles(data);
  if (!data.visibility.certifications || data.certifications.length === 0) return null;
  return (
    <View style={{ marginBottom: gap }} wrap>
      <SectionTitle accent={accent} headingFont={headingFont}>Certifications</SectionTitle>
      {data.certifications.map((c) => (
        <View key={c.id} style={{ marginBottom: 2 }} wrap={false}>
          <Text style={{ fontFamily: SANS, fontSize: fs, fontWeight: 700, lineHeight: lh }}>{c.name}</Text>
          <Text style={{ fontFamily: SANS, fontSize: fs - 1, color: "#666" }}>{c.issuer}</Text>
        </View>
      ))}
    </View>
  );
}

function CustomSectionsBlock({ data }: { data: ResumeData }) {
  if (!data.customSections.length) return null;
  return (
    <>
      {data.customSections.map((cs) => (
        <View key={cs.id} style={{ marginBottom: 10 }} wrap>
          <SectionTitle accent={data.theme.accentColor} headingFont={getStyles(data).headingFont}>{cs.title}</SectionTitle>
          <Bullets items={cs.items.map(i => i.text)} fs={getStyles(data).fs} lh={getStyles(data).lh} />
        </View>
      ))}
    </>
  );
}

const pageBase = StyleSheet.create({
  page: { padding: 40, fontFamily: SANS, fontSize: 10.5, color: "#111" },
}).page;

export function ResumeDocument({ data }: { data: ResumeData }) {
  return (
    <Document title="Resume" author="ResumeForge" creator="ResumeForge AI">
      <Page size="A4" style={pageBase}>
        <Header data={data} />
        <SummaryBlock data={data} />
        <ExperienceBlock data={data} />
        <EducationBlock data={data} />
        <SkillsBlock data={data} />
        <ProjectsBlock data={data} />
        <CertificationsBlock data={data} />
        <CustomSectionsBlock data={data} />
      </Page>
    </Document>
  );
}