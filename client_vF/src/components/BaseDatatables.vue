<template>
  <table id="example" class="display" style="width:100%">
    <thead>
      <tr>
        <th>ID</th>
        <th>Name</th>
        <th>Salary</th>
        <th>Gender</th>
      </tr>
      <tr>
        <th class="filterhead">ID</th>
        <th class="filterhead">Name</th>
        <th class="filterhead">Salary</th>
        <th class="filterhead">Gender</th>
      </tr>
    </thead>
    <tbody></tbody>
  </table>
</template>
<script>
import $ from "jquery";

export default {
  name: "base-datatables",
  mounted: function() {
    this.initDatables();
  },
  methods: {
    initDatables: function() {
      $(this.$el).DataTable({
        pagingType: "full_numbers",
        processing: true,
        serverSide: true,
        pageLength: 5,
        ajax: "http://localhost:8081/api/sample",
        columns: [
          { data: "id", name: "ID", title: "ID" },
          { data: "name", name: "Name", title: "Name" },
          { data: "salary", name: "Salary", title: "Salary" },
          { data: "gender", name: "Gender", title: "Gender" },
        ],
        initComplete: function() {
          var api = this.api();
          $(".filterhead", api.table().header()).each(function(i) {
            var column = api.column(i);
            var select = $('<select><option value=""></option></select>')
              .appendTo($(this).empty())
              .on("change", function() {
                var val = $.fn.dataTable.util.escapeRegex($(this).val());
                column.search(val, true, false).draw();
              });

            column
              .data()
              .unique()
              .sort()
              .each(function(d) {
                select.append('<option value="' + d + '">' + d + "</option>");
              });
          });
        },
      });
    },
  },
};
</script>
<style></style>
