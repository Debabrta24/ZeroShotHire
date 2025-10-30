import { motion } from "framer-motion";
import { useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { SkillBadge } from "@/components/skill-badge";
import { Edit, Save, Mail, Briefcase, GraduationCap, Upload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Profile() {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [isEditing, setIsEditing] = useState(false);
  const [profilePhoto, setProfilePhoto] = useState("https://api.dicebear.com/7.x/avataaars/svg?seed=User");
  const [formData, setFormData] = useState({
    name: "John Doe",
    email: "john.doe@email.com",
    role: "Junior Developer",
    education: "Bachelor's Degree",
  });

  const handlePhotoClick = () => {
    fileInputRef.current?.click();
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Please select an image smaller than 5MB",
          variant: "destructive",
        });
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePhoto(reader.result as string);
        toast({
          title: "Photo updated",
          description: "Your profile photo has been updated successfully",
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = () => {
    setIsEditing(false);
    toast({
      title: "Profile updated",
      description: "Your profile information has been saved successfully",
    });
  };

  const handleCancel = () => {
    setIsEditing(false);
    setFormData({
      name: "John Doe",
      email: "john.doe@email.com",
      role: "Junior Developer",
      education: "Bachelor's Degree",
    });
  };

  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-2"
      >
        <h1 className="text-4xl font-heading font-bold">Your Profile</h1>
        <p className="text-lg text-muted-foreground">
          Manage your personal information and career preferences
        </p>
      </motion.div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card>
            <CardContent className="p-8">
              <div className="flex flex-col items-center text-center space-y-4">
                <Avatar className="h-32 w-32">
                  <AvatarImage src={profilePhoto} />
                  <AvatarFallback>JD</AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="text-2xl font-heading font-bold">{formData.name}</h2>
                  <p className="text-muted-foreground">Aspiring Developer</p>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoChange}
                  className="hidden"
                  data-testid="input-photo-upload"
                />
                <Button 
                  variant="outline" 
                  className="w-full gap-2"
                  onClick={handlePhotoClick}
                  data-testid="button-edit-photo"
                >
                  <Upload className="h-4 w-4" />
                  Upload Photo
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Personal Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-2"
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between gap-4 space-y-0">
              <CardTitle>Personal Information</CardTitle>
              {!isEditing ? (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="gap-2"
                  onClick={() => setIsEditing(true)}
                  data-testid="button-edit-info"
                >
                  <Edit className="h-4 w-4" />
                  Edit
                </Button>
              ) : (
                <div className="flex gap-2">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={handleCancel}
                    data-testid="button-cancel"
                  >
                    Cancel
                  </Button>
                  <Button 
                    variant="default" 
                    size="sm" 
                    className="gap-2"
                    onClick={handleSave}
                    data-testid="button-save"
                  >
                    <Save className="h-4 w-4" />
                    Save
                  </Button>
                </div>
              )}
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Full Name</Label>
                  <Input 
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    readOnly={!isEditing}
                    data-testid="input-name" 
                  />
                </div>
                <div className="space-y-2">
                  <Label>Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className="pl-10"
                      readOnly={!isEditing}
                      data-testid="input-email"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Current Role</Label>
                  <div className="relative">
                    <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      value={formData.role}
                      onChange={(e) => handleInputChange('role', e.target.value)}
                      className="pl-10"
                      readOnly={!isEditing}
                      data-testid="input-role"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Education</Label>
                  <div className="relative">
                    <GraduationCap className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      value={formData.education}
                      onChange={(e) => handleInputChange('education', e.target.value)}
                      className="pl-10"
                      readOnly={!isEditing}
                      data-testid="input-education"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Skills */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-4 space-y-0">
            <CardTitle>Your Skills</CardTitle>
            <Button variant="ghost" size="sm" className="gap-2" data-testid="button-manage-skills">
              <Edit className="h-4 w-4" />
              Manage
            </Button>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {[
                "JavaScript",
                "React",
                "TypeScript",
                "Node.js",
                "Python",
                "Git",
                "HTML/CSS",
                "SQL",
              ].map((skill) => (
                <SkillBadge key={skill} skill={skill} isUserSkill />
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Career Goals */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-4 space-y-0">
            <CardTitle>Career Goals</CardTitle>
            <Button variant="ghost" size="sm" className="gap-2" data-testid="button-update-goals">
              <Edit className="h-4 w-4" />
              Update
            </Button>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {[
                "High Salary",
                "Work-Life Balance",
                "Remote Work",
                "Continuous Learning",
              ].map((goal) => (
                <li key={goal} className="flex items-center gap-2 text-muted-foreground">
                  <div className="w-2 h-2 rounded-full bg-primary" />
                  {goal}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
