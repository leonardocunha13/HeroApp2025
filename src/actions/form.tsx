import { Amplify } from 'aws-amplify';
import outputs from '../../amplify_outputs.json';
import type { Schema } from "../../amplify/data/resource";
import { generateClient } from "aws-amplify/data";
import { getCurrentUser } from 'aws-amplify/auth'; // Ensure getCurrentUser is imported correctly
import { formSchemaType } from "../schemas/form";

Amplify.configure(outputs);

const client = generateClient<Schema>();

// UserNotFoundErr class for custom error handling
class UserNotFoundErr extends Error { }

export async function GetFormStats() {
  try {
    const { userId } = await getCurrentUser();
    if (!userId) {
      throw new UserNotFoundErr();
    }

    // Fetch all forms associated with the current user
    const { data: forms, errors } = await client.models.Form.list();

    if (errors) {
      console.error(errors);
      return { visits: 0, submissions: 0, submissionRate: 0, bounceRate: 0 };
    }

    // Filter forms belonging to the current user
    const userForms = forms.filter((form) => form.userId === userId);

    // Calculate the stats
    const visits = userForms.reduce((sum, form) => sum + (form.visits || 0), 0);
    const submissions = userForms.reduce(
      (sum, form) => sum + (form.submissions || 0),
      0
    );

    let submissionRate = 0;
    if (visits > 0) {
      submissionRate = (submissions / visits) * 100;
    }

    const bounceRate = 100 - submissionRate;

    // Return the stats object
    return {
      visits,
      submissions,
      submissionRate,
      bounceRate,
    };
  } catch (error) {
    console.error("Error fetching form stats:", error);
    return { visits: 0, submissions: 0, submissionRate: 0, bounceRate: 0 };
  }
}

export async function CreateForm(data: formSchemaType) {
  try {
    const { userId } = await getCurrentUser();
    if (!userId) {
      throw new UserNotFoundErr();
    }

    const { errors, data: form } = await client.models.Form.create({
      userId: userId,
      name: data.name,
      description: data.description,
    });

    if (errors) {
      console.error("Error creating form:", errors);
      throw new Error("Something went wrong while creating the form");
    }

    return form?.id;
  } catch (error) {
    console.error("Error in CreateForm:", error);
    throw new Error("Failed to create form.");
  }
}

export async function GetForms() {
  try {
    const { userId } = await getCurrentUser();
    if (!userId) {
      throw new UserNotFoundErr();
    }

    // Fetch all forms associated with the current user
    const { data: forms, errors } = await client.models.Form.list({
      filter: { userId: { eq: userId } },
    });

    if (errors) {
      console.error(errors);
      return [];
    }

    return forms;
  } catch (error) {
    console.error("Error fetching forms:", error);
    return [];
  }
}

export async function GetFormById(id: string) {
  try {
    const { userId } = await getCurrentUser();
    if (!userId) {
      throw new UserNotFoundErr();
    }

    const { data: form, errors } = await client.models.Form.get({
      id,
    });

    if (errors) {
      console.error(errors);
      return null;
    }

    if (form && form.userId === userId) {
      return form;
    }

    throw new Error("Form not found or doesn't belong to the current user.");
  } catch (error) {
    console.error("Error fetching form by ID:", error);
    return null;
  }
}

export async function UpdateFormContent(id: string, content: string) {
  try {
    const { userId } = await getCurrentUser();
    if (!userId) {
      throw new UserNotFoundErr();
    }

    const form = {
      id: id,
      userId: userId,
      content: content,
    };

    const { data: updatedForm, errors } = await client.models.Form.update(form);

    if (errors) {
      console.error(errors);
      throw new Error("Failed to update form content.");
    }

    return updatedForm;
  } catch (error) {
    console.error("Error updating form content:", error);
    throw new Error("Failed to update form content.");
  }
}

export async function PublishForm(id: string) {
  try {
    const { userId } = await getCurrentUser();
    if (!userId) {
      throw new UserNotFoundErr();
    }

    const form = {
      id: id,
      userId: userId,
      published: true,
    };

    const { data: updatedForm, errors } = await client.models.Form.update(form);

    if (errors) {
      console.error(errors);
      throw new Error("Failed to publish the form.");
    }

    return updatedForm;
  } catch (error) {
    console.error("Error publishing form:", error);
    throw new Error("Failed to publish the form.");
  }
}

export async function GetFormContentByUrl(formUrl: string) {
  try {
    const { userId } = await getCurrentUser();
    if (!userId) {
      throw new UserNotFoundErr();
    }

    const { data: forms, errors } = await client.models.Form.list({
      filter: { shareURL: { eq: formUrl } },
    });

    if (errors || !forms || forms.length === 0) {
      console.error(errors || "Form not found, please try again.");
      throw new Error("Form not found.");
    }

    const form = forms[0];
    const updatedVisits = form.visits ? form.visits + 1 : 1;

    const updatedForm = {
      id: form.id,
      visits: updatedVisits,
    };

    const { errors: updateErrors } = await client.models.Form.update(updatedForm);

    if (updateErrors) {
      console.error(updateErrors);
      throw new Error("Failed to update form visits.");
    }

    return form.content;
  } catch (error) {
    console.error("Error fetching form content by URL:", error);
    throw new Error("Error fetching form content by URL.");
  }
}

export async function SubmitForm(formUrl: string, content: string) {
  try {
    const { data: forms } = await client.models.Form.list({
      filter: {
        shareURL: { eq: formUrl },
        published: { eq: true },
      },
    });

    const form = forms[0];

    const newFormSubmission = await client.models.FormSubmissions.create({
      formId: form.id,
      content: content,
    });

    const updatedSubmissions = form.submissions ? form.submissions + 1 : 1;

    const updatedForm = await client.models.Form.update({
      id: form.id,
      submissions: updatedSubmissions,
    });

    return {
      form: updatedForm,
      newSubmission: newFormSubmission,
    };
  } catch (error) {
    console.error("Error submitting form:", error);
    throw new Error("Failed to submit the form.");
  }
}

export async function GetFormWithSubmissions(id: string) {
  try {
    const { userId } = await getCurrentUser();
    if (!userId) {
      throw new UserNotFoundErr();
    }

    const { data: form, errors } = await client.models.Form.get({ id });

    if (errors) {
      console.error(errors);
      return null;
    }

    if (form && form.userId === userId) {
      const { data: submissions, errors: submissionErrors } = await client.models.FormSubmissions.list({
        filter: { formId: { eq: form.id } },
      });

      if (submissionErrors) {
        console.error(submissionErrors);
      }

      return { ...form, submissions };
    }

    throw new Error("Form not found or doesn't belong to the current user.");
  } catch (error) {
    console.error("Error fetching form with submissions:", error);
    throw new Error("Failed to fetch form with submissions.");
  }
}