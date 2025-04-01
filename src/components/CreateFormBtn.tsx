"use client";

import { useForm } from "react-hook-form";
import { ImSpinner2 } from "react-icons/im";
import { Button } from "./ui/button";
import { Root, Content, Title, Description, Trigger, Header, Footer } from "./ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "./ui/form";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { toast } from "./ui/use-toast";
import { CreateForm } from "../actions/form";
import { BsFileEarmarkPlus } from "react-icons/bs";
import { Link } from "react-router-dom"; // Import Link from react-router-dom
import { zodResolver } from "@hookform/resolvers/zod";
import { formSchema, formSchemaType } from "../schemas/form";

function CreateFormBtn() {
  const form = useForm<formSchemaType>({
    resolver: zodResolver(formSchema),
  });

  async function onSubmit(values: formSchemaType) {
    try {
      await CreateForm(values); // Create form, but we're not using formId now
      toast({
        title: "Success",
        description: "Form created successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong, please try again later",
        variant: "destructive",
      });
    }
  }

  return (
    <Root>
      <Trigger asChild>
        <Button
          variant={"outline"}
          className="group border border-primary/20 h-[190px] items-center justify-center flex flex-col hover:border-primary hover:cursor-pointer border-dashed gap-4"
        >
          <BsFileEarmarkPlus className="h-8 w-8 text-muted-foreground group-hover:text-primary" />
          <p className="font-bold text-xl text-muted-foreground group-hover:text-primary">Create new form</p>
        </Button>
      </Trigger>
      <Content>
        <Header>
          <Title>Create form</Title>
          <Description>Create a new form to start collecting responses</Description>
        </Header>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea rows={5} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
        <Footer>
          <Link to="/form-builder"> {/* Link component to navigate declaratively */}
            <Button disabled={form.formState.isSubmitting} className="w-full mt-4">
              {!form.formState.isSubmitting && <span>Save</span>}
              {form.formState.isSubmitting && <ImSpinner2 className="animate-spin" />}
            </Button>
          </Link>
        </Footer>
      </Content>
    </Root>
  );
}

export default CreateFormBtn;