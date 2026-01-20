import { useParams, useNavigate } from "react-router-dom";
import Editor from "../components/Editor";
import { useGraph } from "../api/hooks/useGraphs";

const EditorPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const isNewGraph = !id || id === "new";

  const {
    data: graph,
    isLoading,
    error,
  } = useGraph(isNewGraph ? undefined : id);

  const handleBack = () => {
    navigate("/");
  };

  if (isLoading) {
    return (
      <div className="h-screen w-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading mind map...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-screen w-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-white mb-2">Error</h2>
          <p className="text-gray-400 mb-6">
            {error instanceof Error ? error.message : "Failed to load graph"}
          </p>
          <button
            onClick={handleBack}
            className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium transition-colors"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return <Editor graph={graph || null} />;
};

export default EditorPage;
