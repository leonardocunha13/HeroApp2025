import { Box, Card, Flex, Text } from "@radix-ui/themes";

// Dummy data for form statistics (or you can replace it with real data)
const statistics = [
  { title: "Total Forms", value: 12, description: "Forms Created" },
  { title: "Active Forms", value: 9, description: "Forms in Progress" },
  { title: "Completed Forms", value: 7, description: "Forms Completed" },
  { title: "Pending Forms", value: 3, description: "Forms Pending" },
];

const FormStatistics: React.FC = () => {
  return (
    <div className="form-statistics">
      <h2>Form Statistics</h2>
      <div className="stats-container">
        {statistics.map((stat, index) => (
          <Box key={index} maxWidth="240px">
            <Card
              style={{
                padding: "20px",
                boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
                borderRadius: "8px",
              }}
            >
              <Flex gap="3" align="center">
                {/* Avatar */}
                {/* Text content for each stat */}
                <Box>
                  <Text
                    as="div"
                    size="2"
                    weight="bold"
                    style={{ color: "#333" }}
                  >
                    {stat.title}
                  </Text>
                  <Text as="div" size="2" color="gray">
                    {stat.description}
                  </Text>
                  <Text
                    as="div"
                    size="3"
                    weight="bold"
                    style={{ color: "#0070f3" }}
                  >
                    {stat.value}
                  </Text>
                </Box>
              </Flex>
            </Card>
          </Box>
        ))}
      </div>
    </div>
  );
};

export default FormStatistics;
