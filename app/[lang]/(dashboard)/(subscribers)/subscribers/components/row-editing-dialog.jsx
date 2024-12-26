import { Switch } from "@/components/ui/switch";
import { useState, useEffect } from "react";
import { toast } from "@/components/ui/use-toast";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
import FormAutoSize from "./form-auto-size";

const RowEditingDialog = () => {
  const [subscriptions, setSubscriptions] = useState([]);

  // Fetch subscription from the API when the component mounts
  useEffect(() => {
    fetchSubscribers();
  }, []);

  // Fetch subscribers data
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

  // Handle delete and update state
  const handleDelete = async (e, subscriptionId, item) => {
    e.preventDefault(); // Prevent default behavior
    try {
      // Send DELETE request to the backend
      const response = await fetch(
        `http://localhost:3002/api/subscriptions/${subscriptionId}`,
        {
          method: "DELETE",
        }
      );

      // Log the response for debugging
      const responseData = await response.json();
      console.log("Delete response:", responseData);

      if (response.ok) {
        // Show a success toast message
        toast({
          title: "Delete Successful",
          description: (
            <div className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
              <p className="text-primary-foreground">
                Your data has been Deleted Successfully
              </p>
              {/* Optionally display the deleted item details */}
              <pre>{JSON.stringify(item, null, 2)}</pre>
            </div>
          ),
        });

        // Remove subscription from state to immediately reflect change without needing to re-fetch
        setSubscriptions((prevSubscriptions) =>
          prevSubscriptions.filter(
            (subscription) => subscription._id !== subscriptionId
          )
        );
      } else {
        console.error("Error response:", responseData);
        alert(responseData.message || "Failed to delete subscription.");
      }
    } catch (error) {
      // Handle network or unexpected errors
      console.error("Error deleting subscription:", error);
      alert("An error occurred while deleting the subscription.");
    }
  };

  // Toggle subscription active state
  const handleToggle = async (subscriptionId) => {
    const updatedSubscriptions = subscriptions.map((subscription) =>
      subscription._id === subscriptionId
        ? { ...subscription, isActive: !subscription.isActive }
        : subscription
    );
    setSubscriptions(updatedSubscriptions);
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Client Name</TableHead>
          <TableHead>Plan</TableHead>
          <TableHead>Speed</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Start Date</TableHead>
          <TableHead>End Date</TableHead>
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

              {/* User's service plan speed */}
              <TableCell>
                {item.servicePlan
                  ? `${item.servicePlan.speedMbps} MBPS`
                  : "No Speed"}
              </TableCell>

              {/* Toggle Switch */}
              <TableCell>
                <Switch
                  key={item._id}
                  id={item._id}
                  checked={item.isActive} // Checked if item.isActive is true
                />
              </TableCell>
              {/* Start Date */}
              <TableCell>
                {item.servicePlan
                  ? new Date(item.startDate).toLocaleDateString() // Convert start date to a readable format
                  : "No Start Date"}
              </TableCell>
              {/* End Date */}
              <TableCell>
                {item.servicePlan
                  ? new Date(item.endDate).toLocaleDateString() // Convert end date to a readable format
                  : "No End Date"}
              </TableCell>

              {/* Actions */}
              <TableCell className="flex justify-end">
                <div className="flex gap-3">
                  <EditingDialog
                    name={`${item.user.firstName} ${item.user.lastName}`}
                    startDate={item.startDate}
                    endDate={item.endDate}
                    isActive={item.isActive}
                    plan_id={item.servicePlan._id}
                    subscription={item._id}
                    fetchSubscribers = {fetchSubscribers}
                  />
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
                        <AlertDialogAction
                          onClick={(e) => handleDelete(e, item._id)}
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow className="item-center">
            <TableCell colSpan={2} className="text-center">
              No data available
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};

export default RowEditingDialog;

const EditingDialog = ({
  name,
  startDate,
  endDate,
  isActive,
  plan_id,
  subscription,
  fetchSubscribers 
  
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleClose = () => {
    setIsOpen(false); // Close the dialog
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          size="icon"
          variant="outline"
          color="secondary"
          className="h-7 w-7"
        >
          <Icon icon="heroicons:pencil" className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{name}</DialogTitle>
          <FormAutoSize
            startDate={startDate}
            endDate={endDate}
            is_Active={isActive}
            plan_id={plan_id}
            subscription={subscription}
            onClose={handleClose} // Pass the close function to the form
            fetchSubscribers = {fetchSubscribers}

          />
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};
