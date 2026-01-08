"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Layout from "@/layout/Layout";
import { useEffect, useState } from "react";
import { TfiArrowTopRight } from "react-icons/tfi";


function Analytics() {
    const [data, setData] = useState<any>(null);

    const fetchData = async () => {
        const response = await fetch('/api/analytics/card', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            cache: 'no-store' // Disable caching to always fetch fresh data
        });

        setData(await response.json());

        if (!response.ok) {
            throw new Error('Failed to fetch analytics data');
        }

        return response.json();
    };

    useEffect(() => {   
        fetchData()
    }, []);


  return (
    <Layout>
      <div className="max-w-300 mx-auto mt-4 bg-gray-100 p-6 rounded-lg shadow-md">
        <div>
            <h3 className="text-xl font-medium">Dashboard</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                <Card>
                    <CardHeader>
                        <CardTitle>
                            Facebook Reply Count
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex justify-between">
                            <div className="text-[40px] font-bold">
                                {data ? data.facebookReplyCount : '...'}
                            </div>
                            <Button variant={`outline`} className="rounded-full h-10 w-10 flex justify-center items-center">
                                <TfiArrowTopRight />

                            </Button>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>
                            Instagram Reply Count
                        </CardTitle>
                        <CardDescription>

                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex justify-between">
                            <div className="text-[40px] font-bold">
                                {data ? data.instagramReplyCount : '...'}
                            </div>
                            <Button variant={`outline`} className="rounded-full h-10 w-10 flex justify-center items-center">
                                <TfiArrowTopRight />

                            </Button>
                        </div>

                    </CardContent>
                </Card>

            </div>
        </div>
      </div>
    </Layout>
  );
}

export default Analytics;
