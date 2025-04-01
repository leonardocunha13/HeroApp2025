import { useState, useEffect, ReactNode } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../components/ui/card";
import { Skeleton } from "../components/ui/skeleton";
import { LuView } from "react-icons/lu";
import { FaWpforms } from "react-icons/fa";
import { HiCursorClick } from "react-icons/hi";
import { TbArrowBounce } from "react-icons/tb";
import { Separator } from "../components/ui/separator";
import CreateFormBtn from "../components/CreateFormBtn";
import DialogDemo from "../components/CreateFormDialog"
import { Button } from "../components/ui/button";
import { BiRightArrowAlt } from "react-icons/bi";
import { FaEdit } from "react-icons/fa";
import { Badge } from "../components/ui/badge";
import { GetFormStats, GetForms } from "../actions/form";  // Importing directly from api.ts
import { formatDistance } from "date-fns";
import { Link } from "react-router-dom";  // Import Link from react-router-dom

// Main Home component
export default function Home() {
  // State to hold stats and forms data
  const [stats, setStats] = useState<any>(null);
  const [forms, setForms] = useState<any[]>([]);
  const [loadingStats, setLoadingStats] = useState<boolean>(true);
  const [loadingForms, setLoadingForms] = useState<boolean>(true);

  // Fetch stats on mount
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const statsData = await GetFormStats();  // Direct call to GetFormStats
        setStats(statsData);
      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        setLoadingStats(false);
      }
    };

    fetchStats();
  }, []);  // Empty dependency array to run only once

  // Fetch forms on mount
  useEffect(() => {
    const fetchForms = async () => {
      try {
        const formsData = await GetForms();  // Direct call to GetForms
        setForms(formsData);
      } catch (error) {
        console.error("Error fetching forms:", error);
      } finally {
        setLoadingForms(false);
      }
    };

    fetchForms();
  }, []);  // Empty dependency array to run only once

  return (
    <div className="container pt-4">
      {/* Stats Section */}
      <div className="w-full pt-8 gap-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total visits"
          icon={<LuView className="text-blue-600" />}
          helperText="All time form visits"
          value={stats?.visits?.toLocaleString() || "0"}
          loading={loadingStats}
          className="shadow-md shadow-blue-600"
        />
        <StatsCard
          title="Total submissions"
          icon={<FaWpforms className="text-yellow-600" />}
          helperText="All time form submissions"
          value={stats?.submissions?.toLocaleString() || "0"}
          loading={loadingStats}
          className="shadow-md shadow-yellow-600"
        />
        <StatsCard
          title="Submission rate"
          icon={<HiCursorClick className="text-green-600" />}
          helperText="Visits that result in form submission"
          value={stats?.submissionRate ? `${stats.submissionRate}%` : "0%"}
          loading={loadingStats}
          className="shadow-md shadow-green-600"
        />
        <StatsCard
          title="Bounce rate"
          icon={<TbArrowBounce className="text-red-600" />}
          helperText="Visits that leave without interacting"
          value={stats?.bounceRate ? `${stats.bounceRate}%` : "0%"}
          loading={loadingStats}
          className="shadow-md shadow-red-600"
        />
      </div>

      <Separator className="my-6" />

      {/* Forms Section */}
      <h2 className="text-4xl font-bold">Your forms</h2>
      <Separator className="my-6" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <CreateFormBtn />
        {loadingForms ? (
          <FormCardSkeleton />
        ) : (
          forms.map((form) => <FormCard key={form.id} form={form} />)
        )}
      </div>
    </div>
  );
}

// StatsCard: Individual stat card with loading state
function StatsCard({
  title,
  value,
  icon,
  helperText,
  loading,
  className,
}: {
  title: string;
  value: string;
  helperText: string;
  className: string;
  loading: boolean;
  icon: ReactNode;
}) {
  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          {loading ? <Skeleton /> : value}
        </div>
        <p className="text-xs text-muted-foreground pt-1">{helperText}</p>
      </CardContent>
    </Card>
  );
}

// FormCardSkeleton: Placeholder for form cards while loading
function FormCardSkeleton() {
  return <Skeleton className="border-2 border-primary-500/20 h-[190px] w-full" />;
}

// FormCard: Render individual form card with status (published or draft)
function FormCard({ form }: { form: any }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 justify-between">
          <span className="truncate font-bold">{form.name}</span>
          {form.published ? (
            <Badge>Published</Badge>
          ) : (
            <Badge variant="destructive">Draft</Badge>
          )}
        </CardTitle>
        <CardDescription className="flex items-center justify-between text-muted-foreground text-sm">
          {formatDistance(form.createdAt, new Date(), { addSuffix: true })}
          {form.published && (
            <span className="flex items-center gap-2">
              <LuView className="text-muted-foreground" />
              <span>{form.visits?.toLocaleString() || "0"}</span>
              <FaWpforms className="text-muted-foreground" />
              <span>{form.submissions?.toLocaleString() || "0"}</span>
            </span>
          )}
        </CardDescription>
      </CardHeader>
      <CardContent className="h-[20px] truncate text-sm text-muted-foreground">
        {form.description || "No description"}
      </CardContent>
      <CardFooter>
        {form.published ? (
          <Button asChild className="w-full mt-2 text-md gap-4">
            <Link to={`/forms/${form.id}`} className="flex items-center justify-between">
              View submissions <BiRightArrowAlt />
            </Link>
          </Button>
        ) : (
          <Button asChild variant="secondary" className="w-full mt-2 text-md gap-4">
            <Link to={`/builder/${form.id}`} className="flex items-center justify-between">
              Edit form <FaEdit />
            </Link>
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}