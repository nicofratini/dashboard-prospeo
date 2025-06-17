<script setup lang="ts">
definePageMeta({
  layout: 'dashboard',
  breadcrumb: {
    label: 'Charts',
  },
});

interface ChartData {
  date: string;
  desktop: number;
  mobile: number;
}

const dataChart = [
  { name: '1 Nov', total: Math.floor(Math.random() * 2000) + 500, predicted: Math.floor(Math.random() * 2000) + 500 },
  { name: '2 Nov', total: Math.floor(Math.random() * 2000) + 500, predicted: Math.floor(Math.random() * 2000) + 500 },
  { name: '3 Nov', total: Math.floor(Math.random() * 2000) + 500, predicted: Math.floor(Math.random() * 2000) + 500 },
  { name: '4 Nov', total: Math.floor(Math.random() * 2000) + 500, predicted: Math.floor(Math.random() * 2000) + 500 },
  { name: '5 Nov', total: Math.floor(Math.random() * 2000) + 500, predicted: Math.floor(Math.random() * 2000) + 500 },
  { name: '6 Nov', total: Math.floor(Math.random() * 2000) + 500, predicted: Math.floor(Math.random() * 2000) + 500 },
  { name: '7 Nov', total: Math.floor(Math.random() * 2000) + 500, predicted: Math.floor(Math.random() * 2000) + 500 },
  { name: '8 Nov', total: Math.floor(Math.random() * 2000) + 500, predicted: Math.floor(Math.random() * 2000) + 500 },
  { name: '9 Nov', total: Math.floor(Math.random() * 2000) + 500, predicted: Math.floor(Math.random() * 2000) + 500 },
  { name: '10 Nov', total: Math.floor(Math.random() * 2000) + 500, predicted: Math.floor(Math.random() * 2000) + 500 },
];

const barChart = ref(Array.from({ length: 90 }, (_, i) => ({
  date: `2024-${String(Math.floor(i / 30) + 1).padStart(2, '0')}-${String((i % 30) + 1).padStart(2, '0')}`,
  desktop: Number((Math.random() * 3 + 0.99).toFixed(2)),
  mobile: Number((Math.random() * 3 + 0.99).toFixed(2)),
})));

const generateBarChart = () => {
  barChart.value = Array.from({ length: 90 }, (_, i) => ({
    date: `2024-${String(Math.floor(i / 30) + 1).padStart(2, '0')}-${String((i % 30) + 1).padStart(2, '0')}`,
    desktop: Number((Math.random() * 3 + 0.99).toFixed(2)),
    mobile: Number((Math.random() * 3 + 0.99).toFixed(2)),
  }));
};

const dataLineChart = Array.from({ length: 12 }, (_, i) => ({
  'year': 1970 + i,
  'Export Growth Rate': Number((Math.random() * 3 + 1).toFixed(2)),
  'Import Growth Rate': Number((Math.random() * 3 + 1).toFixed(2)),
}));

const data: ChartData[] = [];

for (let index = 0; index < 50; index++) {
  data[index] = {
    date: `2024-${String(Math.floor(index / 30) + 1).padStart(2, '0')}-${String((index % 30) + 1).padStart(2, '0')}`,
    desktop: Math.floor(Math.random() * (800 - 400 + 1)) + 400,
    mobile: Math.floor(Math.random() * (200 - 20 + 1)) + 200,
  };
}
</script>

<template>
  <div class="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
    <div class="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
      <Card>
        <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle class="text-sm font-medium">
            Total Revenue
          </CardTitle>
          <Icon
            name="mdi:trending-up"
            class="h-4 w-4"
          />
        </CardHeader>
        <CardContent class="p-0">
          <div class="text-2xl font-bold px-6">
            $45,231.89
          </div>
          <p class="text-xs text-muted-foreground px-6">
            <span class="text-green-500">+20.1%</span> from last month
          </p>
          <LineChart
            index="year"
            class="h-[100px] my-4"
            :data="dataLineChart"
            :categories="['Export Growth Rate']"
            :y-formatter="(tick, i) => {
              return typeof tick === 'number'
                ? `$ ${new Intl.NumberFormat('us').format(tick).toString()}`
                : ''
            }"

            :show-grid-line="false"
            :show-legend="false"
            :show-x-axis="false"
            :show-y-axis="false"
          />
        </CardContent>
      </Card>
      <Card>
        <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle class="text-sm font-medium">
            Subscriptions
          </CardTitle>
          <Icon
            name="mdi:account-group"
            class="h-4 w-4"
          />
        </CardHeader>
        <CardContent>
          <div class="text-2xl font-bold">
            +2350
          </div>
          <p class="text-xs text-muted-foreground">
            <span class="text-green-500">+180.1%</span> from last month
          </p>
          <LineChart
            index="year"
            class="h-[100px] my-4"
            :data="dataLineChart"
            :categories="['Export Growth Rate']"
            :y-formatter="(tick, i) => {
              return typeof tick === 'number'
                ? `$ ${new Intl.NumberFormat('us').format(tick).toString()}`
                : ''
            }"

            :show-grid-line="false"
            :show-legend="false"
            :show-x-axis="false"
            :show-y-axis="false"
          />
        </CardContent>
      </Card>
      <Card>
        <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle class="text-sm font-medium">
            Sales
          </CardTitle>
          <Icon
            name="mdi:dollar"
            class="h-4 w-4"
          />
        </CardHeader>
        <CardContent>
          <div class="text-2xl font-bold">
            +12,234
          </div>
          <p class="text-xs text-muted-foreground">
            <span class="text-green-500">+19%</span> from last month
          </p>
          <LineChart
            index="year"
            class="h-[100px] my-4"
            :data="dataLineChart"
            :categories="['Export Growth Rate']"
            :y-formatter="(tick, i) => {
              return typeof tick === 'number'
                ? `$ ${new Intl.NumberFormat('us').format(tick).toString()}`
                : ''
            }"

            :show-grid-line="false"
            :show-legend="false"
            :show-x-axis="false"
            :show-y-axis="false"
          />
        </CardContent>
      </Card>
      <Card>
        <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle class="text-sm font-medium">
            Active Now
          </CardTitle>
          <Icon
            name="mdi:pulse"
            class="h-4 w-4"
          />
        </CardHeader>
        <CardContent>
          <div class="text-2xl font-bold">
            +573
          </div>
          <p class="text-xs text-muted-foreground">
            <span class="text-green-500">+201</span> since last hour
          </p>
          <LineChart
            index="year"
            class="h-[100px] my-4"
            :data="dataLineChart"
            :categories="['Export Growth Rate']"
            :y-formatter="(tick, i) => {
              return typeof tick === 'number'
                ? `$ ${new Intl.NumberFormat('us').format(tick).toString()}`
                : ''
            }"
            :show-grid-line="false"
            :show-legend="false"
            :show-x-axis="false"
            :show-y-axis="false"
          />
        </CardContent>
      </Card>
    </div>
    <div class="grid gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-3">
      <Card class="col-span-3">
        <CardHeader class="flex flex-row items-center">
          <div class="grid gap-2">
            <CardTitle>Transactions</CardTitle>
            <CardDescription>
              Recent transactions from your store.
            </CardDescription>
          </div>
          <Button
            as-child
            size="sm"
            class="ml-auto gap-1"
          >
            <a href="#">
              View All
            </a>
          </Button>
        </CardHeader>
        <CardContent class="p-0 pb-">
          <AreaChart
            :data="data"
            index="date"
            :show-grid-line="false"
            :show-legend="true"
            :show-x-axis="false"
            :show-y-axis="false"
            :categories="['desktop', 'mobile']"
            :colors="['#34d399', '#1d4ed8']"
          />
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Recent Sales</CardTitle>
        </CardHeader>
        <CardContent class="grid gap-8">
          <div class="flex items-center gap-4">
            <Avatar class="hidden h-9 w-9 sm:flex">
              <AvatarImage
                src="/avatar.svg"
                alt="Avatar"
              />
              <AvatarFallback>OM</AvatarFallback>
            </Avatar>
            <div class="grid gap-1">
              <p class="text-sm font-medium leading-none">
                Olivia Martin
              </p>
              <p class="text-sm text-muted-foreground">
                olivia.martin@email.com
              </p>
            </div>
            <div class="ml-auto font-medium">
              +$1,999.00
            </div>
          </div>
          <div class="flex items-center gap-4">
            <Avatar class="hidden h-9 w-9 sm:flex">
              <AvatarImage
                src="/avatar.svg"
                alt="Avatar"
              />
              <AvatarFallback>JL</AvatarFallback>
            </Avatar>
            <div class="grid gap-1">
              <p class="text-sm font-medium leading-none">
                Jackson Lee
              </p>
              <p class="text-sm text-muted-foreground">
                jackson.lee@email.com
              </p>
            </div>
            <div class="ml-auto font-medium">
              +$39.00
            </div>
          </div>
          <div class="flex items-center gap-4">
            <Avatar class="hidden h-9 w-9 sm:flex">
              <AvatarImage
                src="/avatar.svg"
                alt="Avatar"
              />
              <AvatarFallback>IN</AvatarFallback>
            </Avatar>
            <div class="grid gap-1">
              <p class="text-sm font-medium leading-none">
                Isabella Nguyen
              </p>
              <p class="text-sm text-muted-foreground">
                isabella.nguyen@email.com
              </p>
            </div>
            <div class="ml-auto font-medium">
              +$299.00
            </div>
          </div>
          <div class="flex items-center gap-4">
            <Avatar class="hidden h-9 w-9 sm:flex">
              <AvatarImage
                src="/avatar.svg"
                alt="Avatar"
              />
              <AvatarFallback>WK</AvatarFallback>
            </Avatar>
            <div class="grid gap-1">
              <p class="text-sm font-medium leading-none">
                William Kim
              </p>
              <p class="text-sm text-muted-foreground">
                will@email.com
              </p>
            </div>
            <div class="ml-auto font-medium">
              +$99.00
            </div>
          </div>
          <div class="flex items-center gap-4">
            <Avatar class="hidden h-9 w-9 sm:flex">
              <AvatarImage
                src="/avatar.svg"
                alt="Avatar"
              />
              <AvatarFallback>SD</AvatarFallback>
            </Avatar>
            <div class="grid gap-1">
              <p class="text-sm font-medium leading-none">
                John Snow
              </p>
              <p class="text-sm text-muted-foreground">
                john.snow@email.com
              </p>
            </div>
            <div class="ml-auto font-medium">
              +$39.00
            </div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader class="text-center">
          <CardTitle>Pie Chart - Donut with Text</CardTitle>
          <CardDescription>
            Pie chart with text in the center.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <div class="flex items-center gap-4">
            <DonutChart
              index="name"
              :category="'total'"
              :data="dataChart"
              :show-legend="true"
            />
          </div>
        </CardContent>
        <CardFooter class="text-center flex flex-col gap-2">
          <p class="flex items-center gap-2 font-medium leading-none">
            Trending up by 5.2% this month
            <Icon
              name="mdi:trending-up"
              class="h-4 w-4"
            />
          </p>
          <p class="leading-none text-muted-foreground">
            Showing total visitors for the last 6 months
          </p>
        </CardFooter>
      </Card>
      <Card>
        <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle class="text-sm font-medium">
            Sales
          </CardTitle>
          <Icon
            name="mdi:dollar"
            class="h-4 w-4"
          />
        </CardHeader>
        <CardContent>
          <div class="text-2xl font-bold">
            +12,234
          </div>
          <p class="text-xs text-muted-foreground">
            <span class="text-green-500">+19%</span> from last month
          </p>
          <LineChart
            index="year"
            class="h-[250px] my-4"
            :data="dataLineChart"
            :categories="['Export Growth Rate']"
            :y-formatter="(tick, i) => {
              return typeof tick === 'number'
                ? `$ ${new Intl.NumberFormat('us').format(tick).toString()}`
                : ''
            }"

            :show-grid-line="false"
            :show-legend="false"
            :show-x-axis="false"
            :show-y-axis="false"
          />
        </CardContent>
      </Card>
      <Card class="col-span-3">
        <CardHeader class="flex flex-row items-center">
          <CardTitle>User Views</CardTitle>
          <Button
            class="ml-auto gap-1"
            @click="generateBarChart"
          >
            Refresh Data
          </Button>
        </CardHeader>
        <CardContent>
          <BarChart
            :data="barChart"
            index="date"
            :categories="['desktop']"
            :rounded-corners="2"
            :y-formatter="(tick, i, ticks) => {
              return typeof tick === 'number'
                ? `${new Intl.NumberFormat('us').format(tick).toString()}`
                : ''
            }"
          />
        </CardContent>
      </Card>
    </div>
  </div>
</template>
