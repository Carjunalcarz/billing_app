import { Switch } from "@/components/ui/switch";
import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { users } from "./data";
import { Icon } from "@iconify/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const RowEditingDialog = () => {
  const [subscriptions, setSubscriptions] = useState([]);

  // Fetch subscription from the API when the component mounts
  useEffect(() => {
    const fetchSubscribers = async () => {
      try {
        const response = await fetch("http://localhost:3002/api/subscriptions"); // Update with your API URL
        const data = await response.json();
  
        if (data.success) {
          setSubscriptions(data.data); // Set the fetched service plans data
        } else {
          console.error("API error:", data.message);
        }
      } catch (error) {
        console.error("Error fetching service plans:", error);
      }
    };
  
    fetchSubscribers();
  }, []);
  
  // Log the subscriptions state whenever it changes
  useEffect(() => {
    console.log("Updated subscriptions:", subscriptions);
  }, [subscriptions]);

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="font-semibold">Client Name</TableHead>
          <TableHead>Plan</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Role</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Action</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {subscriptions.length > 0 ? (
          subscriptions.map((item) => (
            <TableRow key={item._id}>
              {/* User's first name and last name */}
              <TableCell>
                {item.user
                  ? `${item.user.firstName} ${item.user.lastName}`
                  : "No User"}
              </TableCell>

              {/* User's service plan */}
              <TableCell>
                {item.servicePlan ? item.servicePlan.name : "No Plan"}
              </TableCell>

              {/* User's email */}
              <TableCell>{item.user ? item.user.email : "No Email"}</TableCell>

              {/* User's phone number */}
              <TableCell>
                {item.user ? item.user.phoneNumber : "No Phone"}
              </TableCell>

              {/* Toggle Switch */}
              <TableCell>
                <Switch id={item.user?.email || item._id} />
              </TableCell>

              {/* Actions */}
              <TableCell className="flex justify-end">
                <div className="flex gap-3">
                  <EditingDialog />
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        size="icon"
                        variant="outline"
                        className="h-7 w-7"
                        color="secondary"
                      >
                        <Icon icon="heroicons:trash" className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>
                          Are you absolutely sure?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently
                          delete this subscription.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction>Delete</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={6} className="text-center">
              No data available
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};

export default RowEditingDialog;

const EditingDialog = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          size="icon"
          variant="outline"
          color="secondary"
          className=" h-7 w-7"
        >
          <Icon icon="heroicons:pencil" className=" h-4 w-4  " />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Item</DialogTitle>
          <form action="#" className=" space-y-5 pt-4">
            <div>
              <Label className="mb-2">Name</Label>
              <Input placeholder="Name" />
            </div>
            {/* end single */}
            <div>
              <Label className="mb-2">Title</Label>
              <Input placeholder="Title" />
            </div>
            {/* end single */}
            <div>
              <Label className="mb-2">Email</Label>
              <Input placeholder="Email" type="email" />
            </div>
            {/* end single */}
            <div>
              <Label className="mb-2">Email</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">Admin</SelectItem>
                  <SelectItem value="dark">Owner</SelectItem>
                  <SelectItem value="system">Member</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {/* end single */}
            <div className="flex justify-end space-x-3">
              <DialogClose asChild>
                <Button type="button" variant="outline" color="destructive">
                  Cancel
                </Button>
              </DialogClose>
              <DialogClose asChild>
                <Button color="success">Save</Button>
              </DialogClose>
            </div>
          </form>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};
