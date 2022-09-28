const app = {
	data() {
		return {
			statusList: [
				{ id: 0, label: 'notStarted' },
				{ id: 1, label: 'progress' },
				{ id: 2, label: 'complete' },
			],
			countId: 1,
			newTask: '',
			selectedFilter: 'all',
			sortBy: 'byDate',
			sortOrder: 'asc',
			taskList: [],
		}
	},
	updated() {
	},
	mounted() {
		if (localStorage.getItem('taskList')) {
			try {
				this.countId = parseInt(localStorage.countId);
				this.selectedFilter = localStorage.selectedFilter;
				this.sortBy = localStorage.sortBy;
				this.sortOrder = localStorage.sortOrder;
				this.taskList = JSON.parse(localStorage.taskList);
			} catch(error) {
				console.log('localStorage error');
				localStorage.clear();
			}
		}
	},
	watch: {
		countId() {
			localStorage.countId = this.countId;
		},
		selectedFilter() {
			localStorage.selectedFilter = this.selectedFilter;
		},
		sortBy() {
			localStorage.sortBy = this.sortBy;
		},
		sortOrder() {
			localStorage.sortOrder = this.sortOrder;
		},
		taskList() {
			localStorage.taskList = JSON.stringify(this.taskList);
		}
	},
	computed: {
		isDisabledSubmitBtn() {
			return this.newTask === '' ? true : false ;
		},
		displayTaskList() {
			let displayTaskList = [];
			// filter
			displayTaskList =
				this.selectedFilter === 'incomplete' ? this.taskList.filter((task) => task.status === 0 || task.status === 1) :
				this.selectedFilter === 'notStarted' ? this.taskList.filter((task) => task.status === 0) :
				this.selectedFilter === 'progress' ? this.taskList.filter((task) => task.status === 1) :
				this.selectedFilter === 'complete' ? this.taskList.filter((task) => task.status === 2) :
				this.taskList.slice() ;
			// sort
			const sortKey = this.sortBy === 'byDate' ? 'id' : 'status';
			displayTaskList =
				displayTaskList.slice().sort(this.compareTaskObj(sortKey, this.sortOrder));
			// return
			return displayTaskList;
		},
	},
	methods: {
		onClickAddTaskBtn() {
			this.addNewTask();
		},
		onClickDeleteTaskBtn(taskId) {
			this.deleteTask(taskId);
		},
		onClickToggleSortOrder() {
			this.toggleSortOrder();
		},
		onClickClearAll() {
			this.initializeData();
		},
		addNewTask() {
			if (this.newTask) {
				const newTaskItem = {
					id: this.countId,
					name: this.newTask,
					status: 0
				}
				this.countId++;
				this.taskList = this.taskList.concat(newTaskItem);
				this.newTask = "";
			}
		},
		deleteTask(taskId) {
			this.taskList = this.taskList.filter((task) => task.id !== taskId);
		},
		compareTaskObj(key, order = 'asc') {
			return function(a, b){
				const valueA = a[key];
				const valueB = b[key];
				const comparison = valueA > valueB ? 1 : -1;
				return order === 'desc' ? (comparison * -1) : comparison;
			}
		},
		toggleSortOrder() {
			this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
		},
		async clearLocalStorage() {
			localStorage.clear();
		},
		async clearData() {
			this.countId =  1;
			this.newTask = '';
			this.selectedFilter = 'all';
			this.sortBy = 'byDate';
			this.sortOrder = 'asc';
			this.taskList = [];
		},
		async initializeData() {
			await this.clearData();
			await this.clearLocalStorage();
		}
	}
};

Vue.createApp(app).mount('#app')