import { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Building2 } from "lucide-react";

// Auto-detect API URL based on how the app is accessed
const getApiBaseUrl = () => {
  const envUrl = import.meta.env.VITE_API_URL;

  // If set to "auto", detect the hostname automatically
  if (envUrl === 'auto') {
    const hostname = window.location.hostname;
    return `http://${hostname}:5000`;
  }

  // Otherwise use the configured URL or default to localhost
  return envUrl || 'http://localhost:5000';
};

const API_BASE_URL = getApiBaseUrl();

export interface Department {
  id: string;
  name: string;
  description: string;
}

interface DepartmentSelectorProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

const DepartmentSelector = ({ value, onChange, error }: DepartmentSelectorProps) => {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/departments`);
        const data = await response.json();

        if (data.success && data.data) {
          // Transform API data to match component format
          const transformed = data.data.map((dept: any) => ({
            id: dept.department_id.toString(),
            name: dept.name,
            description: dept.description || ""
          }));
          setDepartments(transformed);
        }
      } catch (error) {
        console.error('Error fetching departments:', error);
        // Set empty array on error - no fallback to hardcoded data
        setDepartments([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDepartments();
  }, []);

  return (
    <div className="space-y-2">
      <Label htmlFor="department" className="flex items-center gap-2">
        <Building2 className="h-4 w-4 text-primary" />
        Select Department
      </Label>
      <Select value={value} onValueChange={onChange} disabled={isLoading}>
        <SelectTrigger
          id="department"
          className={error ? "border-destructive" : ""}
        >
          <SelectValue placeholder={isLoading ? "Loading departments..." : "Choose the department that best matches your needs"} />
        </SelectTrigger>
        <SelectContent className="bg-popover z-50">
          {departments.length === 0 && !isLoading ? (
            <div className="p-4 text-center text-sm text-muted-foreground">
              No departments available
            </div>
          ) : (
            departments.map((dept) => (
              <SelectItem key={dept.id} value={dept.id}>
                <div className="flex flex-col">
                  <span className="font-medium">{dept.name}</span>
                  {dept.description && (
                    <span className="text-xs text-muted-foreground">{dept.description}</span>
                  )}
                </div>
              </SelectItem>
            ))
          )}
        </SelectContent>
      </Select>
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
};

export default DepartmentSelector;
