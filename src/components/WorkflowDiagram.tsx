import { useMemo } from 'react';
import ReactFlow, {
  Node,
  Edge,
  Background,
  Controls,
  NodeTypes,
  useNodesState,
  useEdgesState,
  Position,
  MarkerType,
} from 'reactflow';
import 'reactflow/dist/style.css';

interface WorkflowStage {
  id: string;
  name: string;
  status: 'completed' | 'in-progress' | 'pending' | 'error';
  timestamp?: string;
  details: {
    customer?: string;
    total?: string;
    items?: number;
    method?: string;
    transaction?: string;
    warehouse?: string;
    availability?: string;
    package?: string;
    weight?: string;
    carrier?: string;
    tracking?: string;
    eta?: string;
    address?: string;
  };
}

interface WorkflowDiagramProps {
  stages: WorkflowStage[];
}

const CustomNode = ({ data }: { data: WorkflowStage }) => {
  const getStatusColor = (status: WorkflowStage['status']) => {
    switch (status) {
      case 'completed':
        return 'border-green-500 text-green-700 bg-gradient-to-br from-green-50 to-white';
      case 'in-progress':
        return 'border-yellow-500 text-yellow-700 bg-gradient-to-br from-yellow-50 to-white';
      case 'error':
        return 'border-red-500 text-red-700 bg-gradient-to-br from-red-50 to-white';
      default:
        return 'border-gray-500 text-gray-700 bg-gradient-to-br from-gray-50 to-white';
    }
  };

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const renderDetails = () => {
    const details = Object.entries(data.details).filter(([, value]) => value !== undefined);
    return details.map(([key, value]) => (
      <div key={key} className="flex justify-between text-sm">
        <span className="text-gray-600 capitalize">{key}:</span>
        <span className="text-gray-900 font-medium">{value}</span>
      </div>
    ));
  };

  return (
    <div className={`p-4 rounded-xl border-2 ${getStatusColor(data.status)} w-[250px] shadow-2xl backdrop-blur-sm transition-all duration-200`}>
      <div className="space-y-3">
        <div>
          <h3 className="font-medium text-gray-900">{data.name}</h3>
          {data.timestamp && (
            <p className="text-sm text-gray-500 mt-1">
              {formatDate(data.timestamp)}
            </p>
          )}
        </div>
        <div className="space-y-2">
          {renderDetails()}
        </div>
      </div>
    </div>
  );
};

const nodeTypes: NodeTypes = {
  custom: CustomNode,
};

export default function WorkflowDiagram({ stages }: WorkflowDiagramProps) {
  const initialNodes: Node[] = useMemo(() => {
    return stages.map((stage, index) => ({
      id: stage.id,
      type: 'custom',
      data: stage,
      position: { x: index * 300, y: 0 },
      sourcePosition: Position.Right,
      targetPosition: Position.Left,
    }));
  }, [stages]);

  const initialEdges: Edge[] = useMemo(() => {
    return Array.from({ length: stages.length - 1 }, (_, index) => ({
      id: `edge-${index}`,
      source: stages[index].id,
      target: stages[index + 1].id,
      type: 'smoothstep',
      animated: stages[index].status === 'in-progress',
      style: { 
        strokeWidth: 2,
        stroke: '#94a3b8'
      },
      markerEnd: {
        type: MarkerType.ArrowClosed,
        width: 15,
        height: 15,
        color: '#94a3b8'
      },
    }));
  }, [stages]);

  const [nodes, , onNodesChange] = useNodesState(initialNodes);
  const [edges, , onEdgesChange] = useEdgesState(initialEdges);

  return (
    <div className="h-[400px] w-full border border-gray-200 rounded-lg bg-white">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{ padding: 0.2 }}
        attributionPosition="bottom-right"
        defaultViewport={{ x: 0, y: 0, zoom: 1 }}
        minZoom={0.5}
        maxZoom={1.5}
      >
        <Background color="#f8fafc" gap={16} size={1} />
        <Controls showInteractive={false} />
      </ReactFlow>
    </div>
  );
} 