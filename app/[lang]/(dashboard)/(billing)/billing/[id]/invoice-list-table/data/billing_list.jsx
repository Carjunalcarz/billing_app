import React from "react";

function billing_list() {
  const { data: session, status } = useSession(); // ✅ Get session and auth status
  return <div>billing_list</div>;
}

export default billing_list;
