import SidebarBtnElement from "./SidebarBtnElement";
import { FormElements } from "./FormElements";
import { View, Text, Grid, useTheme } from "@aws-amplify/ui-react";
import { Separator } from "./ui/separator"; // Use Amplify's if you prefer

function FormElementsSidebar() {
  const { tokens } = useTheme();

  return (
    <View >
      <Text fontSize={tokens.fontSizes.small} color={tokens.colors.font.secondary}>
        Drag and drop elements
      </Text>

      <Separator />

      <Grid
        columnGap={tokens.space.small}
        rowGap={tokens.space.xxxs}
        templateColumns={["1fr", "1fr 1fr"]}
        alignItems="start"
        width="100%"
        height="100%"

      >
        <Text
          fontSize={tokens.fontSizes.small}
          color={tokens.colors.font.secondary}
          fontWeight="bold"
          marginTop={tokens.space.small}
          style = {{gridColumn:"span 2"}}
        >
          Layout elements
        </Text>

        <SidebarBtnElement formElement={FormElements.TitleField} />
        <SidebarBtnElement formElement={FormElements.ParagraphField} />
        <SidebarBtnElement formElement={FormElements.SeparatorField} />
        <SidebarBtnElement formElement={FormElements.SpacerField} />
        <SidebarBtnElement formElement={FormElements.ImageField} />

        <Text
          fontSize={tokens.fontSizes.small}
          color={tokens.colors.font.secondary}
          fontWeight="bold"
          marginTop={tokens.space.small}
          style = {{gridColumn:"span 2"}}
        >
          Form elements
        </Text>

        <SidebarBtnElement formElement={FormElements.TextField} />
        <SidebarBtnElement formElement={FormElements.NumberField} />
        <SidebarBtnElement formElement={FormElements.TextAreaField} />
        <SidebarBtnElement formElement={FormElements.DateField} />
        <SidebarBtnElement formElement={FormElements.SelectField} />
        <SidebarBtnElement formElement={FormElements.CheckboxField} />
        <SidebarBtnElement formElement={FormElements.TableField} />
      </Grid>
    </View>
  );
}

export default FormElementsSidebar;
