<script setup lang="ts">
definePageMeta({
  layout: 'dashboard',
  breadcrumb: {
    label: 'Examples',
  },
});
</script>

<template>
  <div class="items-start justify-center gap-6 rounded-lg p-2 md:p-8 md:grid lg:grid-cols-2 xl:grid-cols-3">
    <div class="col-span-2 grid items-start gap-6 lg:col-span-1">
      <Card>
        <CardHeader>
          <CardTitle>Report an issue</CardTitle>
          <CardDescription>
            What area are you having problems with?
          </CardDescription>
        </CardHeader>
        <CardContent class="grid gap-6">
          <div class="grid grid-cols-2 gap-4">
            <div class="grid gap-2">
              <Label for="area">Area</Label>
              <Select default-value="billing">
                <SelectTrigger id="area">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="team">
                    Team
                  </SelectItem>
                  <SelectItem value="billing">
                    Billing
                  </SelectItem>
                  <SelectItem value="account">
                    Account
                  </SelectItem>
                  <SelectItem value="deployments">
                    Deployments
                  </SelectItem>
                  <SelectItem value="support">
                    Support
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div class="grid gap-2">
              <Label for="security-level">Security Level</Label>
              <Select default-value="2">
                <SelectTrigger
                  id="security-level"
                  class="w-full truncate"
                >
                  <SelectValue placeholder="Select level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">
                    Severity 1 (Highest)
                  </SelectItem>
                  <SelectItem value="2">
                    Severity 2
                  </SelectItem>
                  <SelectItem value="3">
                    Severity 3
                  </SelectItem>
                  <SelectItem value="4">
                    Severity 4 (Lowest)
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div class="grid gap-2">
            <Label for="subject">Subject</Label>
            <Input
              id="subject"
              placeholder="I need help with..."
            />
          </div>
          <div class="grid gap-2">
            <Label for="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Please include all information relevant to your issue."
            />
          </div>
        </CardContent>
        <CardFooter class="justify-between space-x-2">
          <Button variant="ghost">
            Cancel
          </Button>
          <Button>Submit</Button>
        </CardFooter>
      </Card>
      <Card>
        <CardHeader class="grid grid-cols-[minmax(0,1fr)_110px] items-start gap-4 space-y-0">
          <div class="space-y-1">
            <CardTitle>Nuxtbe</CardTitle>
            <CardDescription>
              A boilerplate which will help you make your idea alive.
            </CardDescription>
          </div>
          <div class="flex items-center space-x-1 rounded-md bg-secondary text-secondary-foreground">
            <Button
              variant="secondary"
              class="px-3 shadow-none"
            >
              <Icon
                name="mdi:star"
                class="mr-2 h-4 w-4"
              />
              Star
            </Button>
            <Separator
              orientation="vertical"
              class="h-5"
            />
            <DropdownMenu>
              <DropdownMenuTrigger as-child>
                <Button
                  variant="secondary"
                  class="px-2 shadow-none"
                >
                  <Icon
                    name="mdi:chevron-down"
                    class="h-4 w-4 text-secondary-foreground"
                  />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                :align-offset="-5"
                class="w-[200px]"
              >
                <DropdownMenuLabel>Suggested Lists</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuCheckboxItem checked>
                  Future Ideas
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem>My Stack</DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem>Inspiration</DropdownMenuCheckboxItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Icon
                    name="mdi:plus"
                    class="mr-2 h-4 w-4"
                  /> Create List
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>
        <CardContent>
          <div class="flex space-x-4 text-sm text-muted-foreground">
            <div class="flex items-center">
              <Icon
                name="mdi:circle"
                class="mr-1 h-3 w-3 fill-sky-400 text-sky-400"
              />
              TypeScript
            </div>
            <div class="flex items-center">
              <Icon
                name="mdi:star"
                class="mr-1 h-3 w-3"
              />
              20k
            </div>
            <div>Updated Jan 2025</div>
          </div>
        </CardContent>
      </Card>
    </div>

    <div class="col-span-2 grid items-start gap-6 lg:col-span-1">
      <Card>
        <CardHeader>
          <CardTitle>Cookie Settings</CardTitle>
          <CardDescription>Manage your cookie settings here.</CardDescription>
        </CardHeader>
        <CardContent class="grid gap-6">
          <div class="flex items-center justify-between space-x-2">
            <Label
              for="necessary"
              class="flex flex-col space-y-1"
            >
              <span>Strictly Necessary</span>
              <span class="font-normal leading-snug text-muted-foreground">
                These cookies are essential in order to use the website and use
                its features.
              </span>
            </Label>
            <Switch
              id="necessary"
              default-checked
            />
          </div>
          <div class="flex items-center justify-between space-x-2">
            <Label
              for="functional"
              class="flex flex-col space-y-1"
            >
              <span>Functional Cookies</span>
              <span class="font-normal leading-snug text-muted-foreground">
                These cookies allow the website to provide personalized
                functionality.
              </span>
            </Label>
            <Switch id="functional" />
          </div>
          <div class="flex items-center justify-between space-x-2">
            <Label
              for="performance"
              class="flex flex-col space-y-1"
            >
              <span>Performance Cookies</span>
              <span class="font-normal leading-snug text-muted-foreground">
                These cookies help to improve the performance of the website.
              </span>
            </Label>
            <Switch id="performance" />
          </div>
        </CardContent>
        <CardFooter>
          <Button
            variant="outline"
            class="w-full"
          >
            Save preferences
          </Button>
        </CardFooter>
      </Card>
      <Card>
        <CardHeader class="pb-3">
          <CardTitle>Notifications</CardTitle>
          <CardDescription>
            Choose what you want to be notified about.
          </CardDescription>
        </CardHeader>
        <CardContent class="grid gap-1">
          <div class="-mx-2 flex items-start space-x-4 rounded-md p-2 transition-all hover:bg-accent hover:text-accent-foreground">
            <Icon
              name="mdi:bell"
              class="mt-px h-5 w-5"
            />
            <div class="space-y-1">
              <p class="text-sm font-medium leading-none">
                Everything
              </p>
              <p class="text-sm text-muted-foreground">
                Email digest, mentions & all activity.
              </p>
            </div>
          </div>
          <div class="-mx-2 flex items-start space-x-4 rounded-md bg-accent p-2 text-accent-foreground transition-all">
            <Icon
              name="mdi:account"
              class="mt-px h-5 w-5"
            />
            <div class="space-y-1">
              <p class="text-sm font-medium leading-none">
                Available
              </p>
              <p class="text-sm text-muted-foreground">
                Only mentions and comments.
              </p>
            </div>
          </div>
          <div class="-mx-2 flex items-start space-x-4 rounded-md p-2 transition-all hover:bg-accent hover:text-accent-foreground">
            <Icon
              name="mdi:eye-off"
              class="mt-px h-5 w-5"
            />
            <div class="space-y-1">
              <p class="text-sm font-medium leading-none">
                Ignoring
              </p>
              <p class="text-sm text-muted-foreground">
                Turn off all notifications.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>

    <div class="col-span-2 grid items-start gap-6 lg:col-span-2 lg:grid-cols-2 xl:col-span-1 xl:grid-cols-1">
      <Card>
        <CardHeader class="space-y-1">
          <CardTitle class="text-2xl">
            Create an account
          </CardTitle>
          <CardDescription>
            Enter your email below to create your account
          </CardDescription>
        </CardHeader>
        <CardContent class="grid gap-4">
          <div class="grid grid-cols-2 gap-6">
            <Button variant="outline">
              <Icon
                name="simple-icons:github"
                class="mr-2 h-4 w-4"
              />
              GitHub
            </Button>
            <Button variant="outline">
              <Icon
                name="simple-icons:google"
                class="mr-2 h-4 w-4"
              />
              Google
            </Button>
          </div>
          <div class="relative">
            <div class="absolute inset-0 flex items-center">
              <span class="w-full border-t" />
            </div>
            <div class="relative flex justify-center text-xs uppercase">
              <span class="bg-background px-2 text-muted-foreground">
                Or continue with
              </span>
            </div>
          </div>
          <div class="grid gap-2">
            <Label for="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="m@example.com"
            />
          </div>
          <div class="grid gap-2">
            <Label for="password">Password</Label>
            <Input
              id="password"
              type="password"
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button class="w-full">
            Create account
          </Button>
        </CardFooter>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Share this document</CardTitle>
          <CardDescription>
            Anyone with the link can view this document.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div class="flex space-x-2">
            <Input
              value="http://example.com/link/to/document"
              read-only
            />
            <Button
              variant="secondary"
              class="shrink-0"
            >
              Copy Link
            </Button>
          </div>
          <Separator class="my-4" />
          <div class="space-y-4">
            <h4 class="text-sm font-medium">
              People with access
            </h4>
            <div class="grid gap-6">
              <div class="flex items-center justify-between space-x-4">
                <div class="flex items-center space-x-4">
                  <Avatar>
                    <AvatarImage src="/avatar.svg" />
                    <AvatarFallback>OM</AvatarFallback>
                  </Avatar>
                  <div>
                    <p class="text-sm font-medium leading-none">
                      Olivia Martin
                    </p>
                    <p class="text-sm text-muted-foreground">
                      m@example.com
                    </p>
                  </div>
                </div>
                <Select default-value="edit">
                  <SelectTrigger class="ml-auto w-[110px]">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="edit">
                      Can edit
                    </SelectItem>
                    <SelectItem value="view">
                      Can view
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div class="flex items-center justify-between space-x-4">
                <div class="flex items-center space-x-4">
                  <Avatar>
                    <AvatarImage src="/avatar.svg" />
                    <AvatarFallback>IN</AvatarFallback>
                  </Avatar>
                  <div>
                    <p class="text-sm font-medium leading-none">
                      Isabella Nguyen
                    </p>
                    <p class="text-sm text-muted-foreground">
                      b@example.com
                    </p>
                  </div>
                </div>
                <Select default-value="view">
                  <SelectTrigger class="ml-auto w-[110px]">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="edit">
                      Can edit
                    </SelectItem>
                    <SelectItem value="view">
                      Can view
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div class="flex items-center justify-between space-x-4">
                <div class="flex items-center space-x-4">
                  <Avatar>
                    <AvatarImage src="/avatar.svg" />
                    <AvatarFallback>SD</AvatarFallback>
                  </Avatar>
                  <div>
                    <p class="text-sm font-medium leading-none">
                      Sofia Davis
                    </p>
                    <p class="text-sm text-muted-foreground">
                      p@example.com
                    </p>
                  </div>
                </div>
                <Select default-value="view">
                  <SelectTrigger class="ml-auto w-[110px]">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="edit">
                      Can edit
                    </SelectItem>
                    <SelectItem value="view">
                      Can view
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
</template>
