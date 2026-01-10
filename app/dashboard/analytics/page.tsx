"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Layout from "@/layout/Layout";
import moment from "moment";
import { useEffect, useState } from "react";
import { TfiArrowTopRight } from "react-icons/tfi";


function Analytics() {
    const [data, setData] = useState<any>(null);

    const today = moment(new Date()).format('YYYY-MM-DD')
    const weekDaysAgo = moment(new Date().getTime() - 7 * 24 * 60 * 60 * 1000).format('YYYY-MM-DD');

    const fetchData = async () => {
        const response = await fetch(`/api/analytics/card?start=${today}&end=${weekDaysAgo}`, {
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
                                {data ? data.facebook : '...'}
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
                                {data ? data.instagram : '...'}
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
