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
} from "@/components/svg";

export const menusConfig = {
  mainNav: [
    {
      title: "Billing",
      icon: Stacks2,
      child: [
        {
          title: "Add Client",
          href: "/billing",
          icon: Users,
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
          icon: Users,
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
            icon: Users,
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
            icon: Users,
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
            href: "/subscription                                                                            ",
            icon: Users,
          },
          {
            title: "Subscribers",
            href: "/subscribers                                                                            ",
            icon: Users,
          },
        ],
      },
      
    ],
  },
};
