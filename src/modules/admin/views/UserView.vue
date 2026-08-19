<script setup lang="ts">
import BaseAccordion from "@/shared/components/ui/BaseAccordion.vue";
import { ref } from "vue";
import CreateUserModal from "../components/user/CreateUserModal.vue";
import HeaderUserView from "../components/user/HeaderUserView.vue";
import RowUser from "../components/user/RowUser.vue";
import { useGetUsers } from "../queries/get-users.query";

const { data: users } = useGetUsers();

const open = ref(false);

const openModal = () => {
  open.value = true;
};
</script>

<template>
  <section class="px-10 py-8">
    <HeaderUserView @open="openModal" />
    <CreateUserModal :open="open" @close="open = false" />

    <BaseAccordion>
      <RowUser :users="users" />
    </BaseAccordion>
  </section>
</template>
