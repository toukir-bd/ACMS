import {
  Component,
  OnInit,
  AfterViewInit,
  ElementRef,
  ViewChild,
} from "@angular/core";
import { DynamicDialogConfig } from "primeng/dynamicdialog";
import * as go from "gojs";
import { ModalService, BaseComponent, ProviderService } from "..";

@Component({
  selector: "app-work-flow-schema",
  imports: [],
  providers: [ModalService, BaseComponent],
  templateUrl: "./work-flow-schema.component.html",
})
export class WorkFlowSchemaComponent
  extends BaseComponent
  implements OnInit, AfterViewInit
{
  eventData: any;
  modelSvc: any;
  checkStatusColor: any;
  fieldTitle: { [key: string]: string } = {};

  diagram: go.Diagram;
  statusList: any[] = [];
  @ViewChild("myDiagramDiv", { static: true }) diagramRef: ElementRef;

  constructor(
    protected providerSvc: ProviderService,
    public config: DynamicDialogConfig,
    public modalService: ModalService
  ) {
    super(providerSvc);
  }

  ngOnInit(): void {
    this.modalService.setHeader("Workflow Schema");
    this.modalService.setWidth("70%");
    this.eventData = this.config.data?.eventData;
    this.statusList = this.config.data?.statusList;
    this.checkStatusColor = this.config.data?.eventData;
    this.modelSvc = this.config.data?.modelSvc;
  }

  ngAfterViewInit(): void {
    this.initializeDiagram();
    this.arrangeDiagramNodes();
  }
  initializeDiagram(): void {
    try {
      const $ = go.GraphObject.make;

      this.diagram = $(go.Diagram, this.diagramRef.nativeElement);
      this.diagram.initialContentAlignment = go.Spot.Center;
      this.diagram.undoManager.isEnabled = true;

      this.diagram.toolManager.relinkingTool.isEnabled = true;
      this.diagram.toolManager.linkReshapingTool.isEnabled = true;

      this.diagram.nodeTemplate = $(
        go.Node,
        "Auto",
        $(
          go.Shape,
          new go.Binding("figure", "text", (text) =>
            text === "Start" ? "Circle" : "RoundedRectangle"
          ),
          new go.Binding("fill", "status", (status) =>
            this.statusColor(status)
          ),
          { strokeWidth: 1, stroke: "#666", portId: "", cursor: "pointer" }
        ),
        $(
          go.TextBlock,
          { margin: 10, font: "bold 14px sans-serif", stroke: "#333" },
          new go.Binding("text", "text")
        )
      );

      this.diagram.linkTemplate = $(
        go.Link,
        {
          routing: go.Routing.Normal,
          curve: go.Curve.None,
          corner: 0,
          relinkableFrom: true,
          relinkableTo: true,
          reshapable: false,
        },
        new go.Binding("segmentOffset").makeTwoWay(),
        $(go.Shape),
        $(go.Shape, { toArrow: "Standard" }),
        $(
          go.Panel,
          "Auto",
          $(go.Shape, "RoundedRectangle", {
            fill: "#ffffff",
            stroke: "#cccccc",
          }),
          $(
            go.TextBlock,
            {
              margin: 0.5,
              font: "9px sans-serif",
              stroke: "#000000",
              editable: false,
            },
            new go.Binding("text", "text")
          )
        )
      );

      const statusMap = new Map<
        number,
        { key: number; text: string; status: string }
      >();

      this.eventData.forEach((status: any) => {
        const fromID = status.fromStatusID === null ? 0 : status.fromStatusID;
        const toID = status.toStatusID;

        if (!statusMap.has(fromID)) {
          statusMap.set(fromID, {
            key: fromID,
            text:
              status.fromStatusName == "None" ? "Start" : status.fromStatusName,
            status:
              status.fromStatusName == "None" ? "Start" : status.fromStatusName,
          });
        }

        if (!statusMap.has(toID)) {
          statusMap.set(toID, {
            key: toID,
            text: status.toStatusName,
            status: status.toStatusName,
          });
        }
      });

      const uniqueStatuses = Array.from(statusMap.values());

      const linkGroupMap = new Map<string, number>();

      const fromToEvent = this.eventData.map((status: any) => {
        const from = status.fromStatusID === null ? 0 : status.fromStatusID;
        const to = status.toStatusID;

        const pairKey = `${Math.min(from, to)}<->${Math.max(from, to)}`;
        const count = linkGroupMap.get(pairKey) || 0;
        linkGroupMap.set(pairKey, count + 1);

        const isReverse = from > to;
        const offsetAmount = 15 + count * 50;

        return {
          from,
          to,
          text: status.event,
          segmentOffset: isReverse
            ? new go.Point(0, -offsetAmount)
            : new go.Point(0, offsetAmount),
        };
      });

      this.diagram.model = new go.GraphLinksModel(uniqueStatuses, fromToEvent);
    } catch (e) {
      this.showErrorMsg(e);
    }
  }

  zoomIn() {
    try {
      this.diagram.commandHandler.increaseZoom();
    } catch (e) {
      this.showErrorMsg(e);
    }
  }
  zoomOut() {
    try {
      this.diagram.commandHandler.decreaseZoom();
    } catch (e) {
      this.showErrorMsg(e);
    }
  }
  resetZoom() {
    try {
      this.diagram.zoomToFit();
    } catch (e) {
      this.showErrorMsg(e);
    }
  }
  exportDiagram() {
    try {
      const img = this.diagram.makeImage({ scale: 1, background: "white" });
      const link = document.createElement("a");
      link.download = "workflow.png";
      link.href = img.src;
      link.click();
    } catch (e) {
      this.showErrorMsg(e);
    }
  }

  statusColor(status: string): string {
    try {
      if (!status || !this.statusList) return "#eeeeee";
      const matched = this.statusList[this.statusList.length - 1].find(
        (item: any) => {
          return item.statusName?.toLowerCase() === status.toLowerCase();
        }
      );
      if (matched?.colorCode?.trim()) {
        return matched.colorCode;
      }

      return "#eeeeee";
    } catch (e) {
      this.showErrorMsg(e);
    }
  }

  arrangeDiagramNodes(): void {
    try {
      if (this.diagram) {
        this.diagram.layout = go.GraphObject.make(go.LayeredDigraphLayout, {
          direction: 0,
          layerSpacing: 150,
          columnSpacing: 100,
          setsPortSpots: false,
        });
      }
    } catch (e) {
      this.showErrorMsg(e);
    }
  }
}
