const { createApp } = Vue;

createApp({
    data() {
        return {
            courses: [
                { name: '', score: null, credit: null }
            ],
            gpa: null,
            totalPoints: 0,
            totalCredits: 0,
            // 绩点换算标准
            gradeScale: [
                { min: 95, max: 100, point: 4.67 },
                { min: 90, max: 94, point: 4.33 },
                { min: 87, max: 89, point: 4.00 },
                { min: 84, max: 86, point: 3.67 },
                { min: 80, max: 83, point: 3.33 },
                { min: 77, max: 79, point: 3.00 },
                { min: 74, max: 76, point: 2.67 },
                { min: 70, max: 73, point: 2.33 },
                { min: 67, max: 69, point: 2.00 },
                { min: 64, max: 66, point: 1.67 },
                { min: 61, max: 63, point: 1.33 },
                { min: 60, max: 60, point: 1.00 },
                { min: 0, max: 59, point: 0.00 }
            ]
        };
    },
    methods: {
        // 添加新课程
        addCourse() {
            this.courses.push({ name: '', score: null, credit: null });
            // 添加动画效果
            this.$nextTick(() => {
                const lastItem = document.querySelector('.course-item:last-child');
                if (lastItem) {
                    lastItem.classList.add('animate__animated', 'animate__bounceIn');
                    setTimeout(() => {
                        lastItem.classList.remove('animate__animated', 'animate__bounceIn');
                    }, 1000);
                }
            });
        },
        
        // 删除课程
        removeCourse(index) {
            const courseItem = document.querySelectorAll('.course-item')[index];
            courseItem.classList.add('animate__animated', 'animate__zoomOutRight');
            
            setTimeout(() => {
                this.courses.splice(index, 1);
                // 如果没有课程了，添加一个空白课程
                if (this.courses.length === 0) {
                    this.courses.push({ name: '', score: null, credit: null });
                }
                this.calculateGPA();
            }, 500);
        },
        
        // 清空所有课程
        clearAll() {
            const courseItems = document.querySelectorAll('.course-item');
            courseItems.forEach((item, i) => {
                item.classList.add('animate__animated', 'animate__zoomOut');
                item.style.animationDelay = `${i * 0.1}s`;
            });
            
            setTimeout(() => {
                this.courses = [{ name: '', score: null, credit: null }];
                this.gpa = null;
                this.totalPoints = 0;
                this.totalCredits = 0;
            }, 800);
        },
        
        // 根据分数获取绩点
        getGradePoint(score) {
            if (score === null || isNaN(score)) return 0;
            
            for (const grade of this.gradeScale) {
                if (score >= grade.min && score <= grade.max) {
                    return grade.point;
                }
            }
            return 0;
        },
        
        // 计算GPA
        calculateGPA() {
            let totalPoints = 0;
            let totalCredits = 0;
            
            for (const course of this.courses) {
                if (course.score !== null && course.credit !== null && !isNaN(course.score) && !isNaN(course.credit)) {
                    const point = this.getGradePoint(course.score);
                    totalPoints += point * course.credit;
                    totalCredits += course.credit;
                }
            }
            
            this.totalPoints = totalPoints;
            this.totalCredits = totalCredits;
            
            if (totalCredits > 0) {
                this.gpa = totalPoints / totalCredits;
            } else {
                this.gpa = null;
            }
        },
        
        // 保存数据到本地存储
        saveData() {
            // 过滤掉空课程
            const validCourses = this.courses.filter(course => 
                course.name && course.score !== null && course.credit !== null);
                
            if (validCourses.length === 0) {
                alert('没有有效的课程数据可保存！');
                return;
            }
            
            localStorage.setItem('gpaCalculatorData', JSON.stringify(validCourses));
            
            // 添加保存成功的动画效果
            const saveBtn = document.querySelector('.btn-save');
            saveBtn.classList.add('animate__animated', 'animate__rubberBand');
            setTimeout(() => {
                saveBtn.classList.remove('animate__animated', 'animate__rubberBand');
                alert('数据保存成功！');
            }, 1000);
        },
        
        // 从本地存储加载数据
        loadData() {
            const savedData = localStorage.getItem('gpaCalculatorData');
            
            if (!savedData) {
                alert('没有找到保存的数据！');
                return;
            }
            
            try {
                const parsedData = JSON.parse(savedData);
                if (Array.isArray(parsedData) && parsedData.length > 0) {
                    // 添加加载动画
                    const courseItems = document.querySelectorAll('.course-item');
                    courseItems.forEach(item => {
                        item.classList.add('animate__animated', 'animate__fadeOutLeft');
                    });
                    
                    setTimeout(() => {
                        this.courses = parsedData;
                        this.calculateGPA();
                        
                        this.$nextTick(() => {
                            const newItems = document.querySelectorAll('.course-item');
                            newItems.forEach((item, i) => {
                                item.classList.add('animate__animated', 'animate__fadeInRight');
                                item.style.animationDelay = `${i * 0.1}s`;
                            });
                        });
                        
                        alert('数据加载成功！');
                    }, 500);
                } else {
                    alert('保存的数据格式不正确！');
                }
            } catch (e) {
                alert('数据加载失败：' + e.message);
            }
        }
    },
    watch: {
        // 监听课程数据变化，自动计算GPA
        courses: {
            handler() {
                this.calculateGPA();
            },
            deep: true
        }
    },
    mounted() {
        // 页面加载时添加动画效果
        document.querySelectorAll('.course-item').forEach((item, index) => {
            item.style.animationDelay = `${index * 0.1}s`;
        });
        
        // 尝试从本地存储加载数据
        const savedData = localStorage.getItem('gpaCalculatorData');
        if (savedData) {
            try {
                const parsedData = JSON.parse(savedData);
                if (Array.isArray(parsedData) && parsedData.length > 0) {
                    this.courses = parsedData;
                    this.calculateGPA();
                }
            } catch (e) {
                console.error('加载保存数据失败:', e);
            }
        }
    }
}).mount('#app');