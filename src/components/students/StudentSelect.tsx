
import React, { useState, useCallback } from 'react';
import { Command, CommandInput, CommandEmpty, CommandGroup, CommandItem } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Check, ChevronsUpDown, Search } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Student {
  id: string;
  name: string;
  grade?: string;
  section?: string;
  gender?: string;
  contact?: string;
}

interface StudentSelectProps {
  students: Student[];
  value: string;
  onValueChange: (value: string, student: Student | undefined) => void;
  placeholder?: string;
  className?: string;
}

export const StudentSelect: React.FC<StudentSelectProps> = ({
  students = [], // Default empty array
  value = '',   // Default empty string
  onValueChange,
  placeholder = "Select a student",
  className
}) => {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Ensure students is always an array to prevent iteration errors
  const safeStudents = Array.isArray(students) ? students : [];
  
  // Find the selected student
  const selectedStudent = safeStudents.find(student => student.id === value);
  
  // Filter the students based on search query
  const filteredStudents = searchQuery
    ? safeStudents.filter(student => 
        student.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        student.id.toLowerCase().includes(searchQuery.toLowerCase()))
    : safeStudents.slice(0, 10); // Limit initial list to 10 students
  
  // Handle student selection
  const handleSelect = useCallback((currentValue: string) => {
    // Only proceed if we have a valid string
    if (typeof currentValue !== 'string') return;
    
    const student = safeStudents.find(s => s.id === currentValue);
    onValueChange(currentValue, student);
    setOpen(false);
    setSearchQuery('');
  }, [safeStudents, onValueChange]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <div className={cn("w-full", className)}>
          <button
            type="button"
            className={cn(
              "flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1",
              className
            )}
            role="combobox"
            aria-expanded={open}
            aria-label="Select a student"
          >
            <span className="flex-1 truncate text-left">
              {selectedStudent ? `${selectedStudent.name} (${selectedStudent.id})` : placeholder}
            </span>
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </button>
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0" align="start">
        <Command className="rounded-lg border shadow-md">
          <div className="flex items-center border-b px-3">
            <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
            <CommandInput
              placeholder="Search students..."
              className="flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
              value={searchQuery}
              onValueChange={setSearchQuery}
            />
          </div>
          
          <CommandEmpty className="py-6 text-center text-sm">
            No student found.
          </CommandEmpty>
          
          {/* Explicitly check if filteredStudents exists and has items */}
          <CommandGroup className="max-h-[200px] overflow-auto">
            {filteredStudents && filteredStudents.length > 0 ? (
              filteredStudents.map(student => (
                <CommandItem
                  key={student.id}
                  value={student.id}
                  onSelect={handleSelect}
                  className="flex items-center"
                >
                  <div className="flex-1">
                    {student.name} 
                    <span className="ml-2 text-xs text-muted-foreground">({student.id})</span>
                  </div>
                  {student.id === value && (
                    <Check className="ml-2 h-4 w-4" />
                  )}
                </CommandItem>
              ))
            ) : (
              searchQuery ? null : (
                <div className="py-6 text-center text-sm">
                  Type to search students
                </div>
              )
            )}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
};
