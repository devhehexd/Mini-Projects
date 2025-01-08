import { useState, useEffect } from 'react';
import { enrollmentAPI, courseAPI } from '../../../api/services';

// 2024/11/16 gnuke 학생 상태 조회 등을 관리할 훅
const useFetchInitialData = (studentId) => {
    const [enrolledCourses, setEnrolledCourses] = useState([]); // 초기값 설정
    const [myTimeTable, setMyTimeTable] = useState(Array(9).fill().map(() => Array(5).fill(null)));
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // useEffect(() => {
    //     const fetchInitialData = async () => {
    //         setLoading(true);
    //         try {
    //             // // 학생 상태 조회 API 호출
    //             // const studentStatus = await enrollmentAPI.getStatus();
    //             // const history = await enrollmentAPI.getHistory(studentStatus.user.semester, studentStatus.user.id);

    //             // // 수강 내역을 기반으로 등록된 강의 정보 가져오기
    //             // const enrolledCoursesData = await Promise.all(
    //             //     history.map(item => courseAPI.getCourse(item.courseId))
    //             // );

    //             // setEnrolledCourses(enrolledCoursesData);
    //             const response = await enrollmentAPI.getStudentEnrollments(studentId);
    //             console.log(response)
    //             setEnrolledCourses(response);
    //         } catch (err) {
    //             setError('초기 데이터를 불러오는데 실패했습니다.');
    //             console.error('Error fetching initial data:', err);
    //         } finally {
    //             setLoading(false);
    //         }
    //     };

    //     fetchInitialData();
    // }, []);

    // return { enrolledCourses, loading, error };

    const fetchData = async () => {
        try {
            setLoading(true);
            const data = await enrollmentAPI.getStudentEnrollments(studentId);
            setEnrolledCourses(data.myClassList);

            setMyTimeTable(data.myTimeTable.map(row =>
                row.map(cell => cell ? {
                    courseCode: cell.courseCode,
                    courseName: cell.courseName
                } : null)
            ));

        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [studentId]);

    return {
        enrolledCourses: enrolledCourses,
        myTimeTable: myTimeTable,
        loading,
        error,
        refreshEnrollments: fetchData
    };

};

export default useFetchInitialData;
