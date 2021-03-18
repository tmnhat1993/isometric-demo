export default class TaskManagement {
 /* ===================================
  *  CONSTRUCTOR
  * =================================== */
 constructor() {
  // Elements
  this.bindEvents();
 }

 /* ===================================
  *  EVENTS
  * =================================== */
 bindEvents() {
  this.TaskManagementSetup();
 }

 /* ===================================
  *  METHODS
  * =================================== */
 TaskManagementSetup() {
  this.$ToDoList = $('#main-todo-list');
  this.$AddTaskButton = $('#add-new-task');
  this.$NewTaskInput = $('#new-task-name');

  this.taskManagementData = this.LoadData();

  // First task render
  this.RenderTask();

  // Bind Events
  this.TaskManagementEvents();
 }

 RenderTask() {
  let htmlTasksArr = this.taskManagementData.taskList.map(item => {
   return `<li class="todo-item ${item.status == 1 ? 'undone' : 'done'}" id="${item.id}">
   <div class="task-name">${item.name}</div>
   <div class="task-action">
    <button class="cta-btn task-done-btn">
     <i class="fas fa-check"></i>
    </button>
    <button class="cta-btn task-delete-btn">
     <i class="fas fa-times"></i>
    </button>
   </div>
  </li>`
  });

  this.$ToDoList.html(htmlTasksArr.join(''));
 }

 TaskManagementEvents() {
  // Delete Task
  $(document).on('click','.task-delete-btn',(e) => {
   let $taskItemTarget = $(e.target).parents('.todo-item');

   let taskId = $taskItemTarget.attr('id');

   // Index of the task inside tasklist object
   let indexOfTask = this.taskManagementData.taskList.findIndex(item => item.id === taskId);

   if (indexOfTask >= 0) {
    // Remove The Element
    this.taskManagementData.taskList.splice(indexOfTask,1);

    // Save To Local Storage
    this.SaveData();

    // Rerender Task List
    this.RenderTask();
   }
  });

  // Done Task
  $(document).on('click','.task-done-btn',(e) => {
   let $taskItemTarget = $(e.target).parents('.todo-item');

   let taskId = $taskItemTarget.attr('id');

   // Index of the task inside tasklist object
   let task = this.taskManagementData.taskList.find(item => item.id === taskId);

   // New Status
   if (task.status == 1) {
    task.status = 2;
   } else {
    task.status = 1;
   }

   // Save To Local Storage
   this.SaveData();

   // Rerender Task List
   this.RenderTask();
  })

  // Add Task
  this.$AddTaskButton.on('click',(e) => {
   this.AddTask();
  });

  this.$NewTaskInput.on('keyup',(e) => {
   if (e.keyCode == 13 || e.code == 'Enter' || e.key == "Enter") {
    this.AddTask();
   }
  });
 }

 AddTask() {
  if (this.$NewTaskInput.val() !== '') {
   let taskName = this.$NewTaskInput.val()
   this.taskManagementData.taskList.push({
    id: `task-${Math.floor(Math.random() * 10000)}`,
    name: taskName,
    status: 1 // 1 is undone, 2 is done
   });

   // Clear The Input
   this.$NewTaskInput.val('');

   this.SaveData();

   // Rerender Task
   this.RenderTask();
  }
 }

 SaveData() {
  localStorage.setItem('nihatoTodoManagement',JSON.stringify(this.taskManagementData));
 }

 LoadData() {
  if (localStorage.getItem('nihatoTodoManagement')) {
   let data = JSON.parse(localStorage.getItem('nihatoTodoManagement'));
   return data;
  } else {
   return { taskList: [] };
  }
 }
}