import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  AlignmentType,
  Table,
  TableRow,
  TableCell,
  WidthType,
} from "docx";
import { saveAs } from "file-saver";
import { MedicalReportDto } from "../types/dto";

export const generateMedicalReportWord = async (
  report: MedicalReportDto,
  t: (key: string) => string
): Promise<void> => {
  try {
    // Create a new document
    const doc = new Document({
      sections: [
        {
          children: [
            // Header
            new Paragraph({
              children: [
                new TextRun({
                  text: "MEDANO CLINIC",
                  bold: true,
                  size: 32,
                }),
              ],
              alignment: AlignmentType.CENTER,
              spacing: { after: 400 },
            }),

            new Paragraph({
              children: [
                new TextRun({
                  text: t("medicalReport.title"),
                  bold: true,
                  size: 28,
                }),
              ],
              alignment: AlignmentType.CENTER,
              spacing: { after: 600 },
            }),

            // Patient and Doctor Information Table
            new Table({
              width: {
                size: 100,
                type: WidthType.PERCENTAGE,
              },
              rows: [
                new TableRow({
                  children: [
                    new TableCell({
                      children: [
                        new Paragraph({
                          children: [
                            new TextRun({
                              text: `${t("appointments.patient")}: `,
                              bold: true,
                            }),
                            new TextRun({
                              text: report.patientName,
                            }),
                          ],
                        }),
                      ],
                      width: {
                        size: 50,
                        type: WidthType.PERCENTAGE,
                      },
                    }),
                    new TableCell({
                      children: [
                        new Paragraph({
                          children: [
                            new TextRun({
                              text: `${t("appointments.doctor")}: `,
                              bold: true,
                            }),
                            new TextRun({
                              text: report.doctorName,
                            }),
                          ],
                        }),
                      ],
                      width: {
                        size: 50,
                        type: WidthType.PERCENTAGE,
                      },
                    }),
                  ],
                }),
                new TableRow({
                  children: [
                    new TableCell({
                      children: [
                        new Paragraph({
                          children: [
                            new TextRun({
                              text: `${t("appointments.date")}: `,
                              bold: true,
                            }),
                            new TextRun({
                              text: new Date(
                                report.appointmentDate
                              ).toLocaleDateString(),
                            }),
                          ],
                        }),
                      ],
                    }),
                    new TableCell({
                      children: [
                        new Paragraph({
                          children: [
                            new TextRun({
                              text: `${t("doctor.specialization")}: `,
                              bold: true,
                            }),
                            new TextRun({
                              text: report.doctorSpecialization,
                            }),
                          ],
                        }),
                      ],
                    }),
                  ],
                }),
                new TableRow({
                  children: [
                    new TableCell({
                      children: [
                        new Paragraph({
                          children: [
                            new TextRun({
                              text: `${t("appointments.time")}: `,
                              bold: true,
                            }),
                            new TextRun({
                              text: report.appointmentTime,
                            }),
                          ],
                        }),
                      ],
                    }),
                    new TableCell({
                      children: [
                        new Paragraph({
                          children: [
                            new TextRun({
                              text: `${t("medicalReport.createdAt")}: `,
                              bold: true,
                            }),
                            new TextRun({
                              text: new Date(
                                report.createdAt
                              ).toLocaleDateString(),
                            }),
                          ],
                        }),
                      ],
                    }),
                  ],
                }),
              ],
              margins: {
                top: 100,
                bottom: 100,
                right: 100,
                left: 100,
              },
            }),

            // Spacing after table
            new Paragraph({
              children: [new TextRun("")],
              spacing: { after: 400 },
            }),

            // Medical History Section
            new Paragraph({
              children: [
                new TextRun({
                  text: t("medicalReport.medicalHistory"),
                  bold: true,
                  size: 24,
                }),
              ],
              heading: HeadingLevel.HEADING_2,
              spacing: { before: 200, after: 200 },
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: report.antecedente || t("medicalReport.noData"),
                }),
              ],
              spacing: { after: 300 },
            }),

            // Symptoms Section
            new Paragraph({
              children: [
                new TextRun({
                  text: t("medicalReport.symptoms"),
                  bold: true,
                  size: 24,
                }),
              ],
              heading: HeadingLevel.HEADING_2,
              spacing: { before: 200, after: 200 },
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: report.simptome || t("medicalReport.noData"),
                }),
              ],
              spacing: { after: 300 },
            }),

            // Clinical Examination Section
            new Paragraph({
              children: [
                new TextRun({
                  text: t("medicalReport.clinicalExam"),
                  bold: true,
                  size: 24,
                }),
              ],
              heading: HeadingLevel.HEADING_2,
              spacing: { before: 200, after: 200 },
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: report.clinice || t("medicalReport.noData"),
                }),
              ],
              spacing: { after: 300 },
            }),

            // Paraclinical Examination Section
            new Paragraph({
              children: [
                new TextRun({
                  text: t("medicalReport.paraclinicalExam"),
                  bold: true,
                  size: 24,
                }),
              ],
              heading: HeadingLevel.HEADING_2,
              spacing: { before: 200, after: 200 },
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: report.paraclinice || t("medicalReport.noData"),
                }),
              ],
              spacing: { after: 300 },
            }),

            // Diagnosis Section
            new Paragraph({
              children: [
                new TextRun({
                  text: t("medicalReport.diagnosis"),
                  bold: true,
                  size: 24,
                }),
              ],
              heading: HeadingLevel.HEADING_2,
              spacing: { before: 200, after: 200 },
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: report.diagnostic || t("medicalReport.noData"),
                }),
              ],
              spacing: { after: 300 },
            }),

            // Recommendations Section
            new Paragraph({
              children: [
                new TextRun({
                  text: t("medicalReport.recommendations"),
                  bold: true,
                  size: 24,
                }),
              ],
              heading: HeadingLevel.HEADING_2,
              spacing: { before: 200, after: 200 },
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: report.recomandari || t("medicalReport.noData"),
                }),
              ],
              spacing: { after: 300 },
            }),

            // Footer
            new Paragraph({
              children: [new TextRun("")],
              spacing: { before: 600 },
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: "____________________",
                  italics: true,
                }),
              ],
              alignment: AlignmentType.RIGHT,
              spacing: { before: 400 },
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: `Dr. ${report.doctorName}`,
                  italics: true,
                }),
              ],
              alignment: AlignmentType.RIGHT,
              spacing: { after: 200 },
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: report.doctorSpecialization,
                  italics: true,
                  size: 20,
                }),
              ],
              alignment: AlignmentType.RIGHT,
            }),
          ],
        },
      ],
    });

    // Generate and download the document
    const blob = await Packer.toBlob(doc);
    const fileName = `Medical_Report_${report.patientName.replace(
      /\s+/g,
      "_"
    )}_${new Date(report.appointmentDate).toISOString().split("T")[0]}.docx`;
    saveAs(blob, fileName);
  } catch (error) {
    console.error("Error generating Word document:", error);
    throw error;
  }
};

export const printMedicalReport = (
  report: MedicalReportDto,
  t: (key: string) => string
): void => {
  // Simple function that will be handled by the component popup
  // This is just a placeholder - the actual functionality is in the component
};
