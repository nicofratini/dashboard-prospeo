<script setup lang="ts">
const position = ref('bottom');
</script>

<template>
  <div>
    <div>
      <DropdownMenu>
        <DropdownMenuTrigger as-child>
          <Button variant="outline">
            Open
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent class="w-56">
          <DropdownMenuLabel>Panel Position</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuRadioGroup v-model="position">
            <DropdownMenuRadioItem value="top">
              Top
            </DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="bottom">
              Bottom
            </DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="right">
              Right
            </DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>
      <h2>Settings</h2>
    </div>
  </div>
</template>
