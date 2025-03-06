import {
  Application,
  Chart,
  Components,
  DashBoard,
  Stacks2,
  Map,
  Grid,
  Files,
  Graph,
  ClipBoard,
  Cart,
  Envelope,
  Messages,
  Monitor,
  ListFill,
  Calendar,
  Flag,
  Book,
  Note,
  ClipBoard2,
  Note2,
  Note3,
  BarLeft,
  BarTop,
  ChartBar,
  PretentionChartLine,
  PretentionChartLine2,
  Google,
  Pointer,
  Map2,
  MenuBar,
  Icons,
  ChartArea,
  Building,
  Building2,
  Sheild,
  Error,
  Diamond,
  Heroicon,
  LucideIcon,
  CustomIcon,
  Mail,
  Users,
  User
} from "@/components/svg";
import { PrinterIcon } from "lucide-react";

export const menusConfig = {
  mainNav: [
    {
      title: "Billing",
      icon: Stacks2,
      child: [
        {
          title: "Add Client",
          href: "/billing",
          icon: ChartArea,
        },
        {
          title: "Create Billing",
          href: "/create_billing",
          icon: Book,
        },
      ],
    },
    {
      title: "Service Plans",
      icon: Diamond,
      child: [
        {
          title: "Add Plans",
          href: "/serviceplans",
          icon: Monitor,
        },
      ],
    }, {
      title: "Subscribers",
      icon: Calendar,
      child: [
        {
          title: "Add Subscriber",
          href: "/subscription",
          icon: Users,
        },
        {
          title: "Subscribers",
          href: "/subscribers",
          icon: Flag,
        },
      ],
    },
    {
      title: "Subscribers",
      icon: Calendar,
      child: [
        {
          title: "Add Subscriber",
          href: "/subscription",
          icon: Users,
        },
        {
          title: "Subscribers",
          href: "/subscribers",
          icon: Flag,
        },
      ],
    }
  ],



  sidebarNav: {
    modern: [
      {
        title: "Billing",
        icon: Stacks2,
        child: [
          {
            title: "Add Client",
            href: "/billing",
            icon: ChartArea,
          },
          {
            title: "Create Billing",
            href: "/create_billing",
            icon: Book,
          },
        ],
      },
      {
        title: "Service Plans",
        icon: Diamond,
        child: [
          {
            title: "Add Plan",
            href: "/serviceplans",
            icon: Monitor,
          },
        ],
      },
      {
        title: "Subscribers",
        icon: Calendar,
        child: [
          {
            title: "Add Subscriber",
            href: "/subscription",
            icon: ChartBar,
          },
          {
            title: "Subscribers",
            href: "/subscribers",
            icon: Flag,
          },
          {
            title: "Reports",
            href: "/reports",
            icon: Flag,
          },
        ],
      }
      ,
      {
        title: "Invoices",
        icon: PrinterIcon,
        child: [
          {
            title: "Create Invoice",
            href: "/create-invoice",
            icon: ChartBar,
          },
          {
            title: "Invoice Preview",
            href: "/invoice-details",
            icon: Flag,
          },
          {
            title: "Invoice List",
            href: "/invoice-list",
            icon: Flag,
          },
        ],
      }
    ],
    classic: [
      {
        isHeader: true,
        title: "menu",
      },

      {
        title: "Billing",
        icon: Stacks2,
        child: [
          {
            title: "Add Client",
            href: "/billing",
            icon: Users,
          },
          {
            title: "Create Billing",
            href: "/create_billing",
            icon: Book,
          },
        ],
      },
      {
        title: "Service Plans",
        icon: Diamond,
        child: [
          {
            title: "Add Plan",
            href: "/serviceplans",
            icon: Monitor,
          },
        ],
      },
      {
        title: "Subscribers",
        icon: Calendar,
        child: [
          {
            title: "Add Subscriber",
            href: "/subscription",
            icon: Users,
          },
          {
            title: "Subscribers",
            href: "/subscribers",
            icon: Flag,
          },
          {
            title: "Reports",
            href: "/reports",
            icon: Flag,
          },
        ],
      },
      {
        title: "Invoice",
        icon: Calendar,
        child: [
          {
            title: "Create Invoice",
            href: "/subscription",
            icon: Users,
          },
          {
            title: "Invoice List",
            href: "/subscribers",
            icon: Flag,
          },
          {
            title: "Invoice Details",
            href: "/reports",
            icon: Flag,
          },
        ],
      },

    ],
  },
};
