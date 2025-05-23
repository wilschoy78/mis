
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Student, StudentFormData, SortDirection, SortField } from '@/types/student';

export const ITEMS_PER_PAGE = 5;

const initialFormData: StudentFormData = {
  firstName: '',
  lastName: '',
  middleName: '',
  suffix: '',
  grade: '',
  section: '',
  gender: '',
  birthdate: new Date(),
  age: '',
  address: '',
  email: '',
  contact: '',
  guardianName: '',
  guardianContact: ''
};

export const useStudentManagement = (initialStudents: Student[]) => {
  const [students, setStudents] = useState<Student[]>(initialStudents);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState<SortField>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>(null);
  const [formData, setFormData] = useState<StudentFormData>(initialFormData);
  const { toast } = useToast();

  const getFullName = (student: Student) => {
    let fullName = `${student.firstName} ${student.middleName ? student.middleName + ' ' : ''}${student.lastName}`;
    if (student.suffix) {
      fullName += ` ${student.suffix}`;
    }
    return fullName;
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      if (sortDirection === 'asc') {
        setSortDirection('desc');
      } else if (sortDirection === 'desc') {
        setSortDirection(null);
        setSortField(null);
      } else {
        setSortDirection('asc');
      }
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (date: Date, field: string) => {
    setFormData(prev => ({ ...prev, [field]: date }));
    
    // Calculate age if the birthdate changes
    if (field === 'birthdate' && date) {
      const today = new Date();
      let age = today.getFullYear() - date.getFullYear();
      const monthDiff = today.getMonth() - date.getMonth();
      
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < date.getDate())) {
        age--;
      }
      
      setFormData(prev => ({ ...prev, age: age.toString() }));
    }
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const sortAndFilterStudents = () => {
    let result = students.filter(student => 
      getFullName(student).toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.grade.includes(searchTerm) ||
      student.section.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    if (sortField && sortDirection) {
      result = [...result].sort((a, b) => {
        let aValue, bValue;

        if (sortField === 'firstName' || sortField === 'lastName') {
          aValue = a[sortField]?.toLowerCase() || '';
          bValue = b[sortField]?.toLowerCase() || '';
        } else {
          aValue = a[sortField]?.toString().toLowerCase() || '';
          bValue = b[sortField]?.toString().toLowerCase() || '';
        }
        
        if (sortDirection === 'asc') {
          return aValue.localeCompare(bValue);
        } else {
          return bValue.localeCompare(aValue);
        }
      });
    }
    
    return result;
  };

  const handleAddOrUpdateStudent = () => {
    if (!formData.firstName || !formData.lastName || !formData.grade || !formData.section || !formData.gender) {
      toast({
        title: "Error",
        description: "Please fill all required fields",
        variant: "destructive"
      });
      return;
    }

    if (selectedStudent) {
      const updatedStudents = students.map(student => 
        student.id === selectedStudent.id 
          ? { 
              ...formData, 
              id: student.id,
              age: parseInt(formData.age) || 0  // Convert to number
            } 
          : student
      );
      setStudents(updatedStudents);
      toast({
        title: "Success",
        description: "Student updated successfully",
      });
    } else {
      const newStudent = {
        id: (students.length + 1).toString(),
        ...formData,
        age: parseInt(formData.age) || 0  // Convert to number
      };
      setStudents([...students, newStudent]);
      toast({
        title: "Success",
        description: "Student added successfully",
      });
    }
    
    resetFormAndDialog();
  };

  const handleEditStudent = (student: Student) => {
    setSelectedStudent(student);
    setFormData({
      firstName: student.firstName,
      lastName: student.lastName,
      middleName: student.middleName || '',
      suffix: student.suffix || '',
      grade: student.grade,
      section: student.section,
      gender: student.gender,
      birthdate: student.birthdate,
      age: student.age.toString(),
      address: student.address,
      email: student.email,
      contact: student.contact,
      guardianName: student.guardianName,
      guardianContact: student.guardianContact
    });
    setIsAddDialogOpen(true);
  };

  const resetFormAndDialog = () => {
    setFormData(initialFormData);
    setSelectedStudent(null);
    setIsAddDialogOpen(false);
  };

  // Reset to page 1 when search or sort changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, sortField, sortDirection]);

  const filteredStudents = sortAndFilterStudents();
  const totalPages = Math.ceil(filteredStudents.length / ITEMS_PER_PAGE);
  const paginatedStudents = filteredStudents.slice(
    (currentPage - 1) * ITEMS_PER_PAGE, 
    currentPage * ITEMS_PER_PAGE
  );

  return {
    students,
    paginatedStudents,
    currentPage,
    totalPages,
    sortField,
    sortDirection,
    searchTerm,
    isAddDialogOpen,
    selectedStudent,
    formData,
    setSearchTerm,
    setIsAddDialogOpen,
    setCurrentPage,
    handleSort,
    handleInputChange,
    handleDateChange,
    handleSelectChange,
    handleAddOrUpdateStudent,
    handleEditStudent,
    resetFormAndDialog
  };
};
