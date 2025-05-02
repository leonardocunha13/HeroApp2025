"use client";

import { Page, Text, View, Document, StyleSheet, Image } from "@react-pdf/renderer";
import { FormElementInstance } from "./FormElements";

interface Props {
  elements: FormElementInstance[];
  responses: { [key: string]: any };
}

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 12,
    fontFamily: "Helvetica",
    flexDirection: "column",
    gap: 10,
  },
  fieldBlock: {
    marginBottom: 12,
  },
  label: {
    fontWeight: "bold",
    marginBottom: 4,
  },
  textValue: {
    marginBottom: 4,
  },
  image: {
    width: 200,
    height: 200,
    objectFit: "contain",
    marginBottom: 10,
  },
  tableRow: {
    flexDirection: "row",
  },
  tableCell: {
    border: "1px solid black",
    padding: 4,
    width: 100,
    fontSize: 10,
  },
});

export default function PDFSubmissionRenderer({ elements, responses }: Props) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {elements.map((element) => {
          const value = responses[element.id];
          const label = element.extraAttributes?.label || element.type;

      
          if (element.type === "ImageField" && typeof value === "string") {
            return (
              <View key={element.id} style={styles.fieldBlock}>
                <Text style={styles.label}>{label}</Text>
                <Image style={styles.image} src={value} />
              </View>
            );
          }


          if (element.type === "TableField" && Array.isArray(value)) {
            return (
              <View key={element.id} style={styles.fieldBlock}>
                <Text style={styles.label}>{label}</Text>
                {value.map((row: string[], rowIndex: number) => (
                  <View key={rowIndex} style={styles.tableRow}>
                    {row.map((cell: string, colIndex: number) => (
                      <Text key={colIndex} style={styles.tableCell}>
                        {cell}
                      </Text>
                    ))}
                  </View>
                ))}
              </View>
            );
          }

          
          return (
            <View key={element.id} style={styles.fieldBlock}>
              <Text style={styles.label}>{label}</Text>
              <Text style={styles.textValue}>{String(value ?? "")}</Text>
            </View>
          );
        })}
      </Page>
    </Document>
  );
}
